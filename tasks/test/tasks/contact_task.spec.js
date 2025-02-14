const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

const title = 'Task for contact';

const CONTACT = {
  _id: 'patient_id',
  name: 'Current Patient',
};

describe('Trigger Report Task', () => {
  it('resolves when Resolve Report Task form is submitted', async () => {
    harness.state.contacts.push({
      type: 'person',
      reported_date: new Date().getTime(),
      ...CONTACT
    });

    const [task, ...additionalTasks] = await harness.getTasks({ title });
    expect(additionalTasks).to.be.empty;

    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.loadAction(task, []);

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      inputs: {
        source: 'task',
        source_id: CONTACT._id,
        task_id: '',
        from_modify_content: {
          event_id: 'contact_task_event_id',
        },
        contact: CONTACT,
      },
      patient_uuid: CONTACT._id,
      submit: ''
    });

    const summary = await harness.countTaskDocsByState({ title });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 1, Failed: 0, Total: 1 });
  });

  it('fails after 2 days when Resolve Report Task form is not submitted', async () => {
    harness.state.contacts.push({
      type: 'person',
      reported_date: new Date().getTime(),
      ...CONTACT
    });

    const tasks = await harness.getTasks({ title });
    expect(tasks).to.have.length(1);

    await harness.flush(2);

    const summary = await harness.countTaskDocsByState({ title });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 0, Failed: 1, Total: 1 });
  });
});

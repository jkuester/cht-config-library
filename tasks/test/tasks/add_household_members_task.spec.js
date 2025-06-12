const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

const title = 'Add Household Members';

const CONTACT = {
  _id: 'household_id',
  name: 'Current Household',
};

describe('Trigger Add Household Members Task', () => {
  it('resolves when Mark Household Complete form is submitted', async () => {
    harness.state.contacts.push({
      type: 'clinic',
      reported_date: new Date().getTime(),
      ...CONTACT
    });

    const [task, ...additionalTasks] = await harness.getTasks({ title });
    expect(additionalTasks).to.be.empty;

    // First action includes type and parent_id (navigates to add contact form)
    expect(task.emission.actions[0]).to.deep.equal({
      content: {
        parent_id: CONTACT._id,
        source: 'task',
        source_id: CONTACT._id,
        type: 'person',
      },
      forId: CONTACT._id,
      label: 'Add person to household',
      type: 'contact'
    });

    // Select second action
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.loadAction(task.emission.actions[1], []);

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      inputs: { contact: CONTACT },
      patient_uuid: CONTACT._id,
      submit: ''
    });

    const summary = await harness.countTaskDocsByState({ title });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 1, Failed: 0, Total: 1 });
  });

  it('fails after 2 days when Mark Household Complete form is not submitted', async () => {
    harness.state.contacts.push({
      type: 'clinic',
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

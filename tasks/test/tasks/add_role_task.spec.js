const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

const title = 'Add Role';

const CONTACT = {
  _id: 'person_id',
  name: 'Current Patient',
};

describe('Trigger Add Role Task', () => {
  it('resolves when role is added to person', async () => {
    const patientDoc = {
      type: 'person',
      reported_date: new Date().getTime(),
      ...CONTACT
    };
    harness.state.contacts.push(patientDoc);

    const [task, ...additionalTasks] = await harness.getTasks({ title });
    expect(additionalTasks).to.be.empty;

    // Action includes edit_id (navigates to edit contact form)
    expect(task.emission.actions[0]).to.deep.equal({
      content: {
        source: 'task',
        source_id: CONTACT._id,
        edit_id: CONTACT._id,
      },
      forId: CONTACT._id,
      label: 'Follow up',
      type: 'contact'
    });

    // Manually add role to the contact
    patientDoc.role = 'patient';

    const summary = await harness.countTaskDocsByState({ title });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 1, Completed: 0, Failed: 0, Total: 1 });
  });

  it('fails after 2 days when contact is not updated', async () => {
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

module.exports = [
  {
    name: 'report_task',
    title: 'Task for report',
    appliesTo: 'reports',
    appliesToType: ['trigger_report_task'],
    events: [{
      id: 'report_task_event_id',
      days: 0,
      start: 0,
      end: 1,
    }],
    actions: [{
      type: 'report',
      form: 'resolve_report_task',
      label: 'Resolve Task Form',
      modifyContent: (content, contact, report, event) => {
        content.from_modify_content = {
          event_id: event.id,
          source_form: report.form,
        };
      }
    }],
  },
  {
    name: 'contact_task',
    title: 'Task for contact',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    events: [{
      id: 'contact_task_event_id',
      days: 0,
      start: 0,
      end: 1,
    }],
    actions: [{
      type: 'report',
      form: 'resolve_contact_task',
      label: 'Resolve Task Form',
      modifyContent: (content, contact, report, event) => {
        content.from_modify_content = {
          // report not available in contact task
          event_id: event.id,
        };
      }
    }],
  },
];

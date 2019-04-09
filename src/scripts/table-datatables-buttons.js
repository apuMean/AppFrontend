export const TableDatatablesButtons = function () {

	var initTable1 = function () {
		var table = $('#sample_1');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ entries',
				'infoEmpty': 'No entries found',
				'infoFiltered': '(filtered1 from _MAX_ total entries)',
				'lengthMenu': '_MENU_ entries',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			// Or you can use remote translation file
			//"language": {
			//   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
			//},


			buttons: [
				{ extend: 'print', className: 'btn dark btn-outline' },
				{ extend: 'copy', className: 'btn red btn-outline' },
				{ extend: 'pdf', className: 'btn green btn-outline' },
				{ extend: 'excel', className: 'btn yellow btn-outline ' },
				{ extend: 'csv', className: 'btn purple btn-outline ' },
				{ extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns' }
			],

			// setup responsive extension: http://datatables.net/extensions/responsive/
			responsive: true,

			//"ordering": false, disable column ordering 
			//"paging": false, disable pagination

			'order': [
				[0, 'asc']
			],

			'lengthMenu': [
				[5, 10, 15, 20, -1],
				[5, 10, 15, 20, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 10,

			'dom': '<\'row\' <\'col-md-12\'B>><\'row\'<\'col-md-6 col-sm-12\'l><\'col-md-6 col-sm-12\'f>r><\'table-scrollable\'t><\'row\'<\'col-md-5 col-sm-12\'i><\'col-md-7 col-sm-12\'p>>', // horizobtal scrollable datatable

			// Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
			// setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
			// So when dropdowns used the scrollable div should be removed. 
			//"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
		});
	};

	var initTable2 = function () {
		var table = $('#sample_2');
		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ entries',
				'infoEmpty': 'No entries found',
				'infoFiltered': '(filtered1 from _MAX_ total entries)',
				'lengthMenu': '_MENU_ entries',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			// Or you can use remote translation file
			//"language": {
			//   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
			//},

			buttons: [
				{ extend: 'print', className: 'btn default' },
				{ extend: 'copy', className: 'btn default' },
				{ extend: 'pdf', className: 'btn default' },
				{ extend: 'excel', className: 'btn default' },
				{ extend: 'csv', className: 'btn default' },
				{
					text: 'Reload',
					className: 'btn default',
					action: function (e, dt, node, config) {

					}
				}
			],

			'order': [
				[0, 'asc']
			],

			'lengthMenu': [
				[5, 10, 15, 20, -1],
				[5, 10, 15, 20, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 10,

			'dom': '<\'row\' <\'col-md-12\'B>><\'row\'<\'col-md-6 col-sm-12\'l><\'col-md-6 col-sm-12\'f>r><\'table-scrollable\'t><\'row\'<\'col-md-5 col-sm-12\'i><\'col-md-7 col-sm-12\'p>>', // horizobtal scrollable datatable

			// Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
			// setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
			// So when dropdowns used the scrollable div should be removed. 
			//"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
		});
	};

	var initTable3 = function () {
		var table = $('#sample_3');
		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ users',
				'infoEmpty': 'No users found',
				'infoFiltered': '(filtered1 from _MAX_ total users)',
				'lengthMenu': 'Show _MENU_ users',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			// Or you can use remote translation file
			//"language": {
			//   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
			//},

			buttons: [
				{ extend: 'print', className: 'btn dark btn-outline', exportOptions: { columns: [0, 1, 2, 3] } },
				{ extend: 'copy', className: 'btn red btn-outline' },
				{ extend: 'pdf', className: 'btn green btn-outline' },
				{ extend: 'excel', className: 'btn yellow btn-outline ' },
				{ extend: 'csv', className: 'btn purple btn-outline ' },
				{ extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns' }
			],

			// setup responsive extension: http://datatables.net/extensions/responsive/
			responsive: true,

			//"ordering": false, disable column ordering 
			//"paging": false, disable pagination

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, -1],
				[5, 10, 15, 20, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 10,

			//"dom": "<'row' <'col-md-12'>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

			// Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
			// setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
			// So when dropdowns used the scrollable div should be removed. 
			//"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}

			// initTable1();
			// initTable2();
			initTable3();

			// initAjaxDatatables();
		}

	};

}();
export const InviteUserTable = function () {
	var inviteUserList = function () {
		var table = $('#invited_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No records found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},
			buttons: [
				{ extend: 'print', className: 'btn dark btn-outline', exportOptions: { columns: [0, 1, 2, 3] } },
				{ extend: 'copy', className: 'btn red btn-outline' },
				{ extend: 'pdf', className: 'btn green btn-outline' },
				{ extend: 'excel', className: 'btn yellow btn-outline ' },
				{ extend: 'csv', className: 'btn purple btn-outline ' },
				{ extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns' }
			],

			responsive: true,
			'columns': [
				null,
				null,
				null,
				null,
				{ 'orderable': false }
			],
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			inviteUserList();
		}

	};

}();
export const ContactTable = function () {

	var contactList = function () {
		var table = $('#contact_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No records found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			contactList();
		}

	};

}();

export const ContactEstimateTable = function () {

	var estimateList = function () {
		var table = $('#estimates_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ estimates',
				'infoEmpty': 'No estimates found',
				'infoFiltered': '(filtered1 from _MAX_ total estimates)',
				'lengthMenu': 'Show _MENU_ estimates',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			estimateList();
		}

	};

}();
export const ContactProposalTable = function () {

	var proposalList = function () {
		var table = $('#contact_proposal_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ estimates',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total estimates)',
				'lengthMenu': 'Show _MENU_ estimates',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			proposalList();
		}

	};

}();
export const ContactProjectTable = function () {

	var proposalList = function () {
		var table = $('#contac_project_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ estimates',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total estimates)',
				'lengthMenu': 'Show _MENU_ estimates',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			proposalList();
		}

	};

}();
export const ContactActivityTable = function () {

	var proposalList = function () {
		var table = $('#contact_activity_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ estimates',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total estimates)',
				'lengthMenu': 'Show _MENU_ estimates',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			proposalList();
		}

	};

}();
export const CreateContactTable = function () {

	var groupList = function () {
		var table = $('#group_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ groups',
				'infoEmpty': 'No groups found',
				'infoFiltered': '(filtered1 from _MAX_ total groups)',
				'lengthMenu': 'Show _MENU_ groups',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],
			'bDestroy': true,
			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 5,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	var contactList = function () {
		var table = $('#groupcontact_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ contacts',
				'infoEmpty': 'No events found',
				'infoFiltered': '(filtered1 from _MAX_ total contacts)',
				'lengthMenu': 'Show _MENU_ events',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],
			'bDestroy': true,
			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	var multipleContactsList = function () {
		var table = $('#multiple_contacts_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ groups',
				'infoEmpty': 'No groups found',
				'infoFiltered': '(filtered1 from _MAX_ total groups)',
				'lengthMenu': 'Show _MENU_ groups',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'bDestroy': true,
			'order': [],

			'lengthMenu': [
				[5, 10, -1],
				[5, 10, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 5,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			groupList();
			contactList();
			multipleContactsList();
		}

	};

}();

export const OpportunityTable = function () {

	var opportunityList = function () {
		var table = $('#opportunity_list');

		var oTable = table.dataTable({
			'paging':   false,
			'ordering': false,
			'info':     false,
			'searching': false,
			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			// 'language': {
			// 	'aria': {
			// 		'sortAscending': ': activate to sort column ascending',
			// 		'sortDescending': ': activate to sort column descending'
			// 	},
			// 	'emptyTable': 'No data available',
			// 	'info': 'Showing _START_ to _END_ of _TOTAL_ opportunities',
			// 	'infoEmpty': 'No record found',
			// 	'infoFiltered': '(filtered1 from _MAX_ total opportunities)',
			// 	'lengthMenu': 'Show _MENU_ opportunities',
			// 	'search': 'Search:',
			// 	'zeroRecords': 'No matching records found'
			// },

			// setup buttons extentension: http://datatables.net/extensions/buttons/
			buttons: [
				{ extend: 'print', className: 'btn default' },
				{ extend: 'pdf', className: 'btn default' },
				{ extend: 'csv', className: 'btn default' }
			],

			responsive: true,
			// 'order': [],

			// 'lengthMenu': [
			// 	[5, 10, 15, 20, 30, -1],
			// 	[5, 10, 15, 20, 30, 'All'] // change per page values here
			// ],
			// set the initial value
			// 'pageLength': 30,
			// 'scrollCollapse': true,
			// 'paging': true
		});

		$('#opportunity_list_filter input').unbind();
		$('#opportunity_list_filter input').bind('keyup', function (e) {
			if (e.keyCode == 13) {
				oTable.fnFilter(this.value);
			} else if (!this.value) {
				oTable.fnFilter('');
			}
		});

		// handle datatable custom tools
		$('#opportunity_tools a.tool-action').unbind();
		$('#opportunity_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var opportunityEstimate = function () {
		var table = $('#opportunity_estimate');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var opportunityMemos = function () {
		var table = $('#opportunity_memos');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ memos',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total memos)',
				'lengthMenu': 'Show _MENU_ memos',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			opportunityList();
			opportunityEstimate();
			opportunityMemos();
		}

	};

}();

export const ContactLinkTable = function () {

	var contactLinksTable = function () {
		var table = $('#contact_links_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ links',
				'infoEmpty': 'No links found',
				'infoFiltered': '(filtered1 from _MAX_ total links)',
				'lengthMenu': 'Show _MENU_ links',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'bDestroy': true,
			'order': [],

			'lengthMenu': [
				[10, 15, 20, 25, 30, -1],
				[10, 15, 20, 25, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 10,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			contactLinksTable();
		}

	};

}();

export const GroupsTable = function () {
	var groupnameList = function () {
		var table = $('#groupname_list');
		var oTable = table.dataTable({
			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ groups',
				'infoEmpty': 'No groups found',
				'infoFiltered': '(filtered1 from _MAX_ total groups)',
				'lengthMenu': 'Show _MENU_ groups',
				'info': 'Showing _START_ to _END_ of _TOTAL_ groups',
				'infoEmpty': 'No group found',
				'infoFiltered': '(filtered1 from _MAX_ total groups)',
				'lengthMenu': 'Show _MENU_ contacts',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],
			'bDestroy': true,
			'lengthMenu': [
				[8, 15, 20, 25, -1],
				[8, 15, 20, 25, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 8,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			groupnameList();
		}

	};

}();

export const DashboardOpportunityTable = function () {
	var dashboardOpportunityTable = function () {
		var table = $('#dashboard_opportunity');
		var oTable = table.dataTable({
			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ groups',
				'infoEmpty': 'No groups found',
				'infoFiltered': '(filtered1 from _MAX_ total groups)',
				'lengthMenu': 'Show _MENU_ groups',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				// "infoEmpty": "No opportunity found",
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],
			'bDestroy': true,
			'lengthMenu': [
				[8, 15, 20, 25, -1],
				[8, 15, 20, 25, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 8,
			'order': [],
			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			dashboardOpportunityTable();
		}

	};

}();

export const DashboardTasksTable = function () {

	var DashboardTasksTable = function () {
		var table = $('#dashboard_tasks');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ contacts',
				'infoEmpty': 'No tasks found',
				'infoFiltered': '(filtered1 from _MAX_ total contacts)',
				'lengthMenu': 'Show _MENU_ contacts',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DashboardTasksTable();
		}

	};

}();

export const EstimateTable = function () {

	var estimateDataTable = function () {
		var table = $('#estimates_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ estimates',
				'infoEmpty': 'No estimates found',
				'infoFiltered': '(filtered1 from _MAX_ total estimates)',
				'lengthMenu': 'Show _MENU_ estimates',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		$('#estimates_table_filter input').unbind();
		$('#estimates_table_filter input').bind('keyup', function (e) {
			if (e.keyCode == 13) {
				oTable.fnFilter(this.value);
			} else if (!this.value) {
				oTable.fnFilter('');
			}
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	var estimateMemosList = function () {
		var table = $('#estimate_memos');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ memos',
				'infoEmpty': 'No estimates found',
				'infoFiltered': '(filtered1 from _MAX_ total memos)',
				'lengthMenu': 'Show _MENU_ memos',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			estimateDataTable();
			estimateMemosList();
		}

	};

}();
export const PoTable = function () {

	var poDataTable = function () {
		var table = $('#po_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 20,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			poDataTable();
		}

	};

}();
export const ProjectTable = function () {

	var projectDataTable = function () {
		var table = $('#projects_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ projects',
				'infoEmpty': 'No projects found',
				'infoFiltered': '(filtered1 from _MAX_ total projects)',
				'lengthMenu': 'Show _MENU_ projects',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 20,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	var projectMemosList = function () {
		var table = $('#project_memos');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ memos',
				'infoEmpty': 'No estimates found',
				'infoFiltered': '(filtered1 from _MAX_ total memos)',
				'lengthMenu': 'Show _MENU_ memos',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,

			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			projectDataTable();
			projectMemosList();
		}

	};

}();

export const ProposalTable = function () {

	var proposalDataTable = function () {
		var table = $('#proposals_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ proposals',
				'infoEmpty': 'No proposals found',
				'infoFiltered': '(filtered1 from _MAX_ total proposals)',
				'lengthMenu': 'Show _MENU_ proposals',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 20,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			proposalDataTable();
		}

	};

}();

export const DashboardTailgatesTable = function () {

	var DashboardTailgatesTable = function () {
		var table = $('#dash_tailgate');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ contacts',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total contacts)',
				'lengthMenu': 'Show _MENU_ contacts',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DashboardTailgatesTable();
		}

	};

}();

export const DashboardInvoicesTable = function () {

	var DashboardInvoicesTable = function () {
		var table = $('#dash_invoice');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ contacts',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total contacts)',
				'lengthMenu': 'Show _MENU_ contacts',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DashboardInvoicesTable();
		}

	};

}();

export const DashboardOrdersTable = function () {

	var DashboardOrdersTable = function () {
		var table = $('#dash_order');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				// "infoEmpty": "No record found",
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DashboardOrdersTable();
		}

	};

}();

export const DashboardProjectsTable = function () {

	var DashboardProjectsTable = function () {
		var table = $('#dash_project');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ contacts',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total contacts)',
				'lengthMenu': 'Show _MENU_ contacts',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DashboardProjectsTable();
		}

	};

}();

export const DashboardEstimatesTable = function () {

	var DashboardEstimatesTable = function () {
		var table = $('#dash_estimate');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				// "infoEmpty": "No record found",
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DashboardEstimatesTable();
		}

	};

}();

export const ItemTable = function () {

	var ItemList = function () {
		var table = $('#item_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 10,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			ItemList();
		}

	};

}();


export const DocumentTable = function () {

	var DocumentList = function () {
		var table = $('#document_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			DocumentList();
		}

	};

}();
export const ActivityTable = function () {

	var ActivityList = function () {
		var table = $('#activity_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 10,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			ActivityList();
		}

	};

}();


export const TimerTable = function () {

	var TimerList = function () {
		var table = $('#timer_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ records',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total records)',
				'lengthMenu': 'Show _MENU_ records',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 20,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			TimerList();
		}

	};

}();

export const ProjectMoreOptions = function () {

	var trackingList = function () {
		var table = $('#tracking_item');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var costingEstList = function () {
		var table = $('#cost_estimate_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var costingPoList = function () {
		var table = $('#cost_po_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var costingExpList = function () {
		var table = $('#cost_expense_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var costingCallOffList = function () {
		var table = $('#cost_callOff_list');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var projectActivityList = function () {
		var table = $('#project_activity');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var projectTimerList = function () {
		var table = $('#project_timer');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var projectDocumentList = function () {
		var table = $('#project_document');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var projectInvoiceList = function () {
		var table = $('#project_invoice');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var projectDailiesList = function () {
		var table = $('#project_dailies');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	var projectToolsList = function () {
		var table = $('#project_tools');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};
	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			trackingList();
			costingEstList();
			costingPoList();
			costingExpList();
			costingCallOffList();
			projectActivityList();
			projectTimerList();
			projectDocumentList();
			projectInvoiceList();
			projectDailiesList();
			projectToolsList();
		}

	};

}();

export const OrderTable = function () {

	var orderDataTable = function () {
		var table = $('#order_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No records available',
				// "info": "Showing _START_ to _END_ of _TOTAL_ list",
				'infoEmpty': 'No record found',
				// "infoFiltered": "(filtered1 from _MAX_ total list)",
				// "lengthMenu": "Show _MENU_ list",
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},
			// "columns": [
			//     null,
			//     null,
			//     null,
			//     null,
			//     { "orderable": false },
			//     null,
			//     { "orderable": false }
			// ],
			responsive: true,
			'order': [],
			'bLengthChange': false,
			'bInfo': false,
			// "lengthMenu": [
			//     [5, 10, 15, 20, 30, -1],
			//     [5, 10, 15, 20, 30, "All"] // change per page values here
			// ],

			// set the initial value
			'pageLength': 30,
			'paging': true,
		});

		$('#order_table_filter input').unbind();
		$('#order_table_filter input').bind('keyup', function (e) {
			if (e.keyCode == 13) {
				oTable.fnFilter(this.value);
			} else if (!this.value) {
				oTable.fnFilter('');
			}
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	var serviceMemos = function () {
		var table = $('#service_memos');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ memos',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total memos)',
				'lengthMenu': 'Show _MENU_ memos',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		$('#service_memos_filter input').unbind();
		$('#service_memos_filter input').bind('keyup', function (e) {
			if (e.keyCode == 13) {
				oTable.fnFilter(this.value);
			}
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			orderDataTable();
			serviceMemos();
		}

	};

}();

export const InvoiceTable = function () {

	var invoiceDataTable = function () {
		var table = $('#invoice_table');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No data available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			responsive: true,
			'order': [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 30,
			'scrollCollapse': true,
			'paging': true
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			invoiceDataTable();
		}

	};

}();

export const LineItemsTable = function () {

	var lineitemsDatatable = function () {
		function restoreRow(oTable, nRow) {
			var aData = oTable.fnGetData(nRow);
			var jqTds = $('>td', nRow);

			for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
				oTable.fnUpdate(aData[i], nRow, i, false);
			}

			oTable.fnDraw();
		}

		function editRow(oTable, nRow) {
			var aData = oTable.fnGetData(nRow);
			var jqTds = $('>td', nRow);
			// jqTds[0].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[0] + '">';
			jqTds[1].innerHTML = '<input type="text" class="form-control input-small" refs="mfg" value="' + aData[1] + '">';
			jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[2] + '">';
			jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
			jqTds[4].innerHTML = '<input type="number" class="form-control input-small" refs="qty" value="' + aData[4] + '">';
			jqTds[5].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[5] + '">';
			jqTds[6].innerHTML = '<input type="number" class="form-control input-small" refs="ourCost" value="' + aData[6] + '">';
			jqTds[7].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[7] + '">';
			jqTds[8].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[8] + '">';
			jqTds[9].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[9] + '">';
			jqTds[10].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[10] + '">';
			jqTds[11].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[11] + '">';
			jqTds[12].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[12] + '">';
			jqTds[13].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[13] + '">';
			jqTds[14].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[14] + '">';
			jqTds[15].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[15] + '">';
			jqTds[16].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[16] + '">';
			jqTds[17].innerHTML = '<input type="number" class="form-control input-small" value="' + aData[17] + '">';
			// jqTds[18].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
			jqTds[18].innerHTML = '<a class="edit" href="">Save</a>';
			jqTds[19].innerHTML = '<a class="cancel" href="">Cancel</a>';
		}

		function saveRow(oTable, nRow) {
			var jqInputs = $('input', nRow);
			oTable.fnUpdate(jqInputs[0].value, nRow, 1, false);
			oTable.fnUpdate(jqInputs[1].value, nRow, 2, false);
			oTable.fnUpdate(jqInputs[2].value, nRow, 3, false);
			oTable.fnUpdate(jqInputs[3].value, nRow, 4, false);
			oTable.fnUpdate(jqInputs[4].value, nRow, 5, false);
			oTable.fnUpdate(jqInputs[5].value, nRow, 6, false);
			oTable.fnUpdate(jqInputs[6].value, nRow, 7, false);
			oTable.fnUpdate(jqInputs[7].value, nRow, 8, false);
			oTable.fnUpdate(jqInputs[8].value, nRow, 9, false);
			oTable.fnUpdate(jqInputs[9].value, nRow, 10, false);
			oTable.fnUpdate(jqInputs[10].value, nRow, 11, false);
			oTable.fnUpdate(jqInputs[11].value, nRow, 12, false);
			oTable.fnUpdate(jqInputs[12].value, nRow, 13, false);
			oTable.fnUpdate(jqInputs[13].value, nRow, 14, false);
			oTable.fnUpdate(jqInputs[14].value, nRow, 15, false);
			oTable.fnUpdate(jqInputs[15].value, nRow, 16, false);
			oTable.fnUpdate(jqInputs[16].value, nRow, 17, false);
			// oTable.fnUpdate(jqInputs[17].value, nRow, 17, false);
			// oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
			oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 18, false);
			oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 19, false);
			oTable.fnDraw();
		}

		function cancelEditRow(oTable, nRow) {
			var jqInputs = $('input', nRow);
			// oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
			oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
			oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
			oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
			oTable.fnUpdate(jqInputs[6].value, nRow, 6, false);
			oTable.fnUpdate(jqInputs[7].value, nRow, 7, false);
			oTable.fnUpdate(jqInputs[8].value, nRow, 8, false);
			oTable.fnUpdate(jqInputs[9].value, nRow, 9, false);
			oTable.fnUpdate(jqInputs[10].value, nRow, 10, false);
			oTable.fnUpdate(jqInputs[11].value, nRow, 11, false);
			oTable.fnUpdate(jqInputs[12].value, nRow, 12, false);
			oTable.fnUpdate(jqInputs[13].value, nRow, 13, false);
			oTable.fnUpdate(jqInputs[14].value, nRow, 14, false);
			oTable.fnUpdate(jqInputs[15].value, nRow, 15, false);
			oTable.fnUpdate(jqInputs[16].value, nRow, 16, false);
			oTable.fnUpdate(jqInputs[17].value, nRow, 17, false);
			oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 18, false);
			oTable.fnDraw();
		}

		var table = $('#line_items');

		var oTable = table.dataTable({

			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			'language': {
				'aria': {
					'sortAscending': ': activate to sort column ascending',
					'sortDescending': ': activate to sort column descending'
				},
				'emptyTable': 'No records available',
				'info': 'Showing _START_ to _END_ of _TOTAL_ list',
				'infoEmpty': 'No record found',
				'infoFiltered': '(filtered1 from _MAX_ total list)',
				'lengthMenu': 'Show _MENU_ list',
				'search': 'Search:',
				'zeroRecords': 'No matching records found'
			},

			// responsive: true,
			// setup rowreorder extension: http://datatables.net/extensions/rowreorder/
			// rowReorder: true,
			rowReorder: true,
			columnDefs: [
				{ orderable: true, className: 'reorder', targets: 0 },
				{ orderable: false, targets: '_all' }
			],
			// "order": [],

			'lengthMenu': [
				[5, 10, 15, 20, 30, -1],
				[5, 10, 15, 20, 30, 'All'] // change per page values here
			],
			// set the initial value
			'pageLength': 5,
			'scrollCollapse': true,
			'paging': true
		});

		var nEditing = null;
		var nNew = false;

		table.unbind('click').on('click', '.delete', function (e) {
			e.preventDefault();

			if (confirm('Are you sure to delete this row ?') == false) {
				return;
			}

			var nRow = $(this).parents('tr')[0];
			oTable.fnDeleteRow(nRow);
			alert('Deleted! Do not forget to do some ajax to sync with backend :)');
		});

		table.unbind('click').on('click', '.cancel', function (e) {
			e.preventDefault();
			if (nNew) {
				oTable.fnDeleteRow(nEditing);
				nEditing = null;
				nNew = false;
			} else {
				restoreRow(oTable, nEditing);
				nEditing = null;
			}
		});

		table.unbind('click').on('click', '.edit', function (e) {
			e.preventDefault();
			nNew = false;

			/* Get the row as a parent of the link that was clicked on */
			var nRow = $(this).parents('tr')[0];

			if (nEditing !== null && nEditing != nRow) {
				/* Currently editing - but not this row - restore the old before continuing to edit mode */
				restoreRow(oTable, nEditing);
				editRow(oTable, nRow);
				nEditing = nRow;
			} else if (nEditing == nRow && this.innerHTML == 'Save') {
				/* Editing this row and want to save it */
				saveRow(oTable, nEditing);
				nEditing = null;
				alert('Updated! Do not forget to do some ajax to sync with backend :)');
			} else {
				/* No edit in progress - let's start one */
				editRow(oTable, nRow);
				nEditing = nRow;
			}
		});

		// handle datatable custom tools
		$('#sample_3_tools a.tool-action').on('click', function () {
			var action = $(this).attr('data-action');
			oTable.DataTable().button(action).trigger();
		});
	};

	return {

		//main function to initiate the module
		init: function () {

			if (!jQuery().dataTable) {
				return;
			}
			lineitemsDatatable();
		}

	};

}();
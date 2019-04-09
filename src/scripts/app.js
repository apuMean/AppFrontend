import jQuery from 'jquery';
import validate from 'jquery-validation';
import accept from '../../node_modules/jquery-validation/dist/additional-methods';
/**
Core script to handle the entire theme and core functions
**/
export const App = function () {

// IE mode
	var isRTL = false;
	var isIE8 = false;
	var isIE9 = false;
	var isIE10 = false;

	var resizeHandlers = [];

	var assetsPath = '../assets/';

	var globalImgPath = 'global/img/';

	var globalPluginsPath = 'global/plugins/';

	var globalCssPath = 'global/css/';

	// theme layout color set

	var brandColors = {
		'blue': '#89C4F4',
		'red': '#F3565D',
		'green': '#1bbc9b',
		'purple': '#9b59b6',
		'grey': '#95a5a6',
		'yellow': '#F8CB00'
	};

	// initializes main settings
	var handleInit = function () {

		if ($('body').css('direction') === 'rtl') {
			isRTL = true;
		}

		isIE8 = !!navigator
			.userAgent
			.match(/MSIE 8.0/);
		isIE9 = !!navigator
			.userAgent
			.match(/MSIE 9.0/);
		isIE10 = !!navigator
			.userAgent
			.match(/MSIE 10.0/);

		if (isIE10) {
			$('html').addClass('ie10'); // detect IE10 version
		}

		if (isIE10 || isIE9 || isIE8) {
			$('html').addClass('ie'); // detect IE10 version
		}
	};

	// runs callback functions set by App.addResponsiveHandler().
	var _runResizeHandlers = function () {
		// reinitialize other subscribed elements
		for (var i = 0; i < resizeHandlers.length; i++) {
			var each = resizeHandlers[i];
			each.call();
		}
	};

	var handleOnResize = function () {
		var windowWidth = $(window).width();
		var resize;
		if (isIE8) {
			var currheight;
			$(window).resize(function () {
				if (currheight == document.documentElement.clientHeight) {
					return; //quite event since only body resized not window.
				}
				if (resize) {
					clearTimeout(resize);
				}
				resize = setTimeout(function () {
					_runResizeHandlers();
				}, 50); // wait 50ms until window resize finishes.
				currheight = document.documentElement.clientHeight; // store last body client height
			});
		} else {
			$(window)
				.resize(function () {
					if ($(window).width() != windowWidth) {
						windowWidth = $(window).width();
						if (resize) {
							clearTimeout(resize);
						}
						resize = setTimeout(function () {
							_runResizeHandlers();
						}, 50); // wait 50ms until window resize finishes.
					}
				});
		}
	};

	// Handles portlet tools & actions
	var handlePortletTools = function () {
		// handle portlet remove
		$('body')
			.on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
				e.preventDefault();
				var portlet = $(this).closest('.portlet');

				if ($('body').hasClass('page-portlet-fullscreen')) {
					$('body').removeClass('page-portlet-fullscreen');
				}

				portlet
					.find('.portlet-title .fullscreen')
					.tooltip('destroy');
				portlet
					.find('.portlet-title > .tools > .reload')
					.tooltip('destroy');
				portlet
					.find('.portlet-title > .tools > .remove')
					.tooltip('destroy');
				portlet
					.find('.portlet-title > .tools > .config')
					.tooltip('destroy');
				portlet
					.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expan' +
					'd')
					.tooltip('destroy');

				portlet.remove();
			});

		// handle portlet fullscreen
		$('body').on('click', '.portlet > .portlet-title .fullscreen', function (e) {
			e.preventDefault();
			var portlet = $(this).closest('.portlet');
			if (portlet.hasClass('portlet-fullscreen')) {
				$(this).removeClass('on');
				portlet.removeClass('portlet-fullscreen');
				$('body').removeClass('page-portlet-fullscreen');
				portlet
					.children('.portlet-body')
					.css('height', 'auto');
			} else {
				var height = App
					.getViewPort()
					.height - portlet
					.children('.portlet-title')
					.outerHeight() - parseInt(portlet.children('.portlet-body').css('padding-top')) - parseInt(portlet.children('.portlet-body').css('padding-bottom'));

				$(this).addClass('on');
				portlet.addClass('portlet-fullscreen');
				$('body').addClass('page-portlet-fullscreen');
				portlet
					.children('.portlet-body')
					.css('height', height);
			}
		});

		$('body').on('click', '.portlet > .portlet-title > .tools > a.reload', function (e) {
			e.preventDefault();
			var el = $(this)
				.closest('.portlet')
				.children('.portlet-body');
			var url = $(this).attr('data-url');
			var error = $(this).attr('data-error-display');
			if (url) {
				App.blockUI({ target: el, animate: true, overlayColor: 'none' });
				$.ajax({
					type: 'GET',
					cache: false,
					url: url,
					dataType: 'html',
					success: function (res) {
						App.unblockUI(el);
						el.html(res);
						App.initAjax(); // reinitialize elements & plugins for newly loaded content
					},
					error: function (xhr, ajaxOptions, thrownError) {
						App.unblockUI(el);
						var msg = 'Error on reloading the content. Please check your connection and try again.';
						if (error == 'toastr' && toastr) {
							toastr.error(msg);
						} else if (error == 'notific8' && $.notific8) {
							$.notific8('zindex', 11500);
							$.notific8(msg, {
								theme: 'ruby',
								life: 3000
							});
						} else {
							alert(msg);
						}
					}
				});
			} else {
				// for demo purpose
				App.blockUI({ target: el, animate: true, overlayColor: 'none' });
				window.setTimeout(function () {
					App.unblockUI(el);
				}, 1000);
			}
		});

		// load ajax data on page init
		$('.portlet .portlet-title a.reload[data-load="true"]').click();

		$('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools' +
			' > .expand',
		function (e) {
			e.preventDefault();
			var el = $(this)
				.closest('.portlet')
				.children('.portlet-body');
			if ($(this).hasClass('collapse')) {
				$(this)
					.removeClass('collapse')
					.addClass('expand');
				el.slideUp(200);
			} else {
				$(this)
					.removeClass('expand')
					.addClass('collapse');
				el.slideDown(200);
			}
		});
	};

	// Handlesmaterial design checkboxes
	var handleMaterialDesign = function () {

		// Material design ckeckbox and radio effects
		$('body')
			.on('click', '.md-checkbox > label, .md-radio > label', function () {
				var the = $(this);
				// find the first span which is our circle/bubble
				var el = $(this).children('span:first-child');

				// add the bubble class (we do this so it doesnt show on page load)
				el.addClass('inc');

				// clone it
				var newone = el.clone(true);

				// add the cloned version before our original
				el.before(newone);

				// remove the original so that it is ready to run on next click
				$('.' + el.attr('class') + ':last', the).remove();
			});

		if ($('body').hasClass('page-md')) {
			// Material design click effect credit where credit's due;
			// http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-desig
			// n
			var element,
				circle,
				d,
				x,
				y;
			$('body').on('click', 'a.btn, button.btn, input.btn, label.btn', function (e) {
				element = $(this);

				if (element.find('.md-click-circle').length == 0) {
					element.prepend('<span class=\'md-click-circle\'></span>');
				}

				circle = element.find('.md-click-circle');
				circle.removeClass('md-click-animate');

				if (!circle.height() && !circle.width()) {
					d = Math.max(element.outerWidth(), element.outerHeight());
					circle.css({ height: d, width: d });
				}

				x = e.pageX - element
					.offset()
					.left - circle.width() / 2;
				y = e.pageY - element
					.offset()
					.top - circle.height() / 2;

				circle
					.css({
						top: y + 'px',
						left: x + 'px'
					})
					.addClass('md-click-animate');

				setTimeout(function () {
					circle.remove();
				}, 1000);
			});
		}

		// Floating labels
		var handleInput = function (el) {
			if (el.val() != '') {
				el.addClass('edited');
			} else {
				el.removeClass('edited');
			}
		};

		$('body').on('keydown', '.form-md-floating-label .form-control', function (e) {
			handleInput($(this));
		});
		$('body').on('blur', '.form-md-floating-label .form-control', function (e) {
			handleInput($(this));
		});

		$('body').on('hidden.bs.modal', '.modal', function () {
			$('#multiple-contacts .modal-body').find('input:radio, input:checkbox').prop('checked', false);
		});

		// $('#multiple-contacts').on('hidden.bs.modal', function (e) {
		//     $("#myModal .modal-body").find('input:radio, input:checkbox').prop('checked', false);
		// })

		$('.form-md-floating-label .form-control').each(function () {
			//  
			if ($(this).val()) {
				if ($(this).val().length > 0) {
					$(this).addClass('edited');
				}
			}
		});
	};

	// Handles custom checkboxes & radios using jQuery iCheck plugin
	var handleiCheck = function () {
		if (!$().iCheck) {
			return;
		}

		$('.icheck')
			.each(function () {
				var checkboxClass = $(this).attr('data-checkbox')
					? $(this).attr('data-checkbox')
					: 'icheckbox_minimal-grey';
				var radioClass = $(this).attr('data-radio')
					? $(this).attr('data-radio')
					: 'iradio_minimal-grey';

				if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
					$(this).iCheck({
						checkboxClass: checkboxClass,
						radioClass: radioClass,
						insert: '<div class="icheck_line-icon"></div>' + $(this).attr('data-label')
					});
				} else {
					$(this).iCheck({ checkboxClass: checkboxClass, radioClass: radioClass });
				}
			});
	};

	// Handles Bootstrap switches
	var handleBootstrapSwitch = function () {
		if (!$().bootstrapSwitch) {
			return;
		}
		$('.make-switch').bootstrapSwitch();
	};

	// Handles Bootstrap confirmations
	var handleBootstrapConfirmation = function () {
		if (!$().confirmation) {
			return;
		}
		$('[data-toggle=confirmation]').confirmation({ btnOkClass: 'btn btn-sm btn-success', btnCancelClass: 'btn btn-sm btn-danger' });
	};

	// Handles Bootstrap Accordions.
	var handleAccordions = function () {
		$('body')
			.on('shown.bs.collapse', '.accordion.scrollable', function (e) {
				App.scrollTo($(e.target));
			});
	};

	// Handles Bootstrap Tabs.
	var handleTabs = function () {
		//activate tab if tab id provided in the URL
		if (encodeURI(location.hash)) {
			var tabid = encodeURI(location.hash.substr(1));
			$('a[href="#' + tabid + '"]')
				.parents('.tab-pane:hidden')
				.each(function () {
					var tabid = $(this).attr('id');
					$('a[href="#' + tabid + '"]').click();
				});
			$('a[href="#' + tabid + '"]').click();
		}

		if ($().tabdrop) {
			$('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({ text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>' });
		}
	};

	// Handles Bootstrap Modals.
	var handleModals = function () {
		// fix stackable modal issue: when 2 or more modals opened, closing one of modal
		// will remove .modal-open class.
		$('body')
			.on('hide.bs.modal', function () {
				$('body').removeClass('modal-open-noscroll');
				//removing current values from modal popups forms(add phone/email/address)
				$('#mail').val('');
				$('#country').val('1');
				$('#address1').val('');
				$('#address2').val('');
				$('#addCity').val('');
				$('#addState').val('');
				$('#addZip').val('');
				$('#mail').removeClass('edited');
				$('#address1').removeClass('edited');
				$('#address2').removeClass('edited');
				$('#addCity').removeClass('edited');
				$('#addState').removeClass('edited');
				$('#addZip').removeClass('edited');

				//removing current values from modal popups forms(add other contact)
				$('#first_name').val('');
				$('#last_name').val('');
				$('#new_email').val('');
				$('#new_phone').val('');
				$('#first_name').removeClass('edited');
				$('#last_name').removeClass('edited');
				$('#new_email').removeClass('edited');
				$('#new_phone').removeClass('edited');
				$('.contactForm').removeClass('has-error');
				$('#add_other_contact').find('.help-block-error').remove();
				$('#add_proposal_contact').find('.help-block-error').remove();
				// $('#add_other_contact').find('span').remove();

				//removing current values from modal popups shipping add
				$('#shipping_description').val('');
				$('#shipping_amount').val('');
				$('#shipping_description').removeClass('edited');
				$('#shipping_amount').removeClass('edited');

				//removing current values from modal popups labor add
				$('#labor_description').val('');
				$('#labor_quantity').val('');
				$('#labor_hours').val('');
				$('#labor_description').removeClass('edited');
				$('#labor_quantity').removeClass('edited');
				$('#labor_hours').removeClass('edited');

				//removing current values from modal popups header add
				$('#subheader').val('');
				$('#subheader').removeClass('edited');

				//removing current values from lineItem add modal estimate.
				$('#searchItem').val('');

				//removing current values from memo add modal.
				$('#projectMemo').val('');
				$('#oppMemo').val('');
				$('#estMemo').val('');
				$('#servMemo').val('');


				//removing current values from item add modal.
				$('#item_name').val('');
				$('#item_modalNo').val('');
				$('#item_partNo').val('');
				$('#item_manufacturer').val('');
				$('#supplierName').val('');
				$('#listPrice').val('');
				$('#dealerPrice').val('');
				$('#startQty').val('');
				$('#endQty').val('');
				$('#price').val('');
				$('#startQty').removeClass('edited');
				$('#endQty').removeClass('edited');
				$('#price').removeClass('edited');
				$('#item_name').removeClass('edited');
				$('#item_modalNo').removeClass('edited');
				$('#item_partNo').removeClass('edited');
				$('#item_manufacturer').removeClass('edited');
				$('#supplierName').removeClass('edited');
				$('#listPrice').removeClass('edited');
				$('#dealerPrice').removeClass('edited');
				// $('#add_other_item').find('span').remove();
				$('#add_other_item').find('.help-block-error').remove();

				$('.form-group').removeClass('has-error has-feedback');
				$('#sup_add').find('.help-block-error').remove();

				// remove current values from address modal //
				$('#address1').val('');
				$('#address2').val('');
				$('#addState').val('');
				$('#addCity').val('');
				$('#addZip').val('');
				$('#address1').removeClass('edited');
				$('#address2').removeClass('edited');
				$('#addState').removeClass('edited');
				$('#addCity').removeClass('edited');
				$('#addZip').removeClass('edited');
				$('.contactAddrss').removeClass('has-error');
				$('#validateAdd').find('.help-block-error').remove();

				//remove values from add format modal
				$('#formatAddId').val('');

				// //
				$('#fileDesc').val('');

				if ($('.modal:visible').length > 1 && $('html').hasClass('modal-open') === false) {
					$('html').addClass('modal-open');
				} else if ($('.modal:visible').length <= 1) {
					$('html').removeClass('modal-open');
				}
			});

		// fix page scrollbars issue
		$('body').on('show.bs.modal', '.modal', function () {
			// if ($(this).hasClass("modal-scroll")) {
			//     $('body').addClass("modal-open-noscroll");
			// }
			$('body').addClass('modal-open-noscroll');
		});
		$('body').on('shown.bs.modal', '.modal', function () {
			$(this).find('input:text').first().focus();
		});

		// fix page scrollbars issue
		$('body').on('hidden.bs.modal', '.modal', function () {
			$('body').removeClass('modal-open-noscroll');
		});

		// remove ajax content and remove cache on modal closed
		$('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
			$(this).removeData('bs.modal');
		});
	};

	// Handles Bootstrap Tooltips.
	var handleTooltips = function () {
		// global tooltips
		$('.tooltips').tooltip();

		// portlet tooltips
		$('.portlet > .portlet-title .fullscreen').tooltip({ trigger: 'hover', container: 'body', title: 'Fullscreen' });
		$('.portlet > .portlet-title > .tools > .reload').tooltip({ trigger: 'hover', container: 'body', title: 'Reload' });
		$('.portlet > .portlet-title > .tools > .remove').tooltip({ trigger: 'hover', container: 'body', title: 'Remove' });
		$('.portlet > .portlet-title > .tools > .config').tooltip({ trigger: 'hover', container: 'body', title: 'Settings' });
		$('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .too' +
			'ls > .expand').tooltip({ trigger: 'hover', container: 'body', title: 'Collapse/Expand' });
	};

	// Handles Bootstrap Dropdowns
	var handleDropdowns = function () {
		/*
          Hold dropdown on click
        */
		$('body')
			.on('click', '.dropdown-menu.hold-on-click', function (e) {
				e.stopPropagation();
			});
	};

	var handleAlerts = function () {
		$('body')
			.on('click', '[data-close="alert"]', function (e) {
				$(this)
					.parent('.alert')
					.hide();
				$(this)
					.closest('.note')
					.hide();
				e.preventDefault();
			});

		$('body').on('click', '[data-close="note"]', function (e) {
			$(this)
				.closest('.note')
				.hide();
			e.preventDefault();
		});

		$('body').on('click', '[data-remove="note"]', function (e) {
			$(this)
				.closest('.note')
				.remove();
			e.preventDefault();
		});
	};

	// Handle textarea autosize
	var handleTextareaAutosize = function () {
		if (typeof (autosize) == 'function') {
			autosize(document.querySelectorAll('textarea.autosizeme'));
		}
	};

	// Handles Bootstrap Popovers last popep popover
	var lastPopedPopover;

	var handlePopovers = function () {
		$('.popovers').popover();

		// close last displayed popover

		$(document).on('click.bs.popover.data-api', function (e) {
			if (lastPopedPopover) {
				lastPopedPopover.popover('hide');
			}
		});
	};

	// Handles scrollable contents using jQuery SlimScroll plugin.
	var handleScrollers = function () {
		App.initSlimScroll('.scroller');
	};

	// Handles Image Preview using jQuery Fancybox plugin
	var handleFancybox = function () {
		if (!jQuery.fancybox) {
			return;
		}

		if ($('.fancybox-button').length > 0) {
			$('.fancybox-button').fancybox({
				groupAttr: 'data-rel',
				prevEffect: 'none',
				nextEffect: 'none',
				closeBtn: true,
				helpers: {
					title: {
						type: 'inside'
					}
				}
			});
		}
	};

	// Handles counterup plugin wrapper
	var handleCounterup = function () {
		if (!$().counterUp) {
			return;
		}

		$('[data-counter=\'counterup\']').counterUp({ delay: 10, time: 1000 });
	};

	// Fix input placeholder issue for IE8 and IE9
	var handleFixInputPlaceholderForIE = function () {
		//fix html5 placeholder attribute for ie7 & ie8
		if (isIE8 || isIE9) {
			// ie8 & ie9
			// this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
			$('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placehol' +
				'der-no-fix)')
				.each(function () {
					var input = $(this);

					if (input.val() === '' && input.attr('placeholder') !== '') {
						input
							.addClass('placeholder')
							.val(input.attr('placeholder'));
					}

					input
						.focus(function () {
							if (input.val() == input.attr('placeholder')) {
								input.val('');
							}
						});

					input.blur(function () {
						if (input.val() === '' || input.val() == input.attr('placeholder')) {
							input.val(input.attr('placeholder'));
						}
					});
				});
		}
	};

	// Handle Select2 Dropdowns
	var handleSelect2 = function () {
		if ($().select2) {
			$
				.fn
				.select2
				.defaults
				.set('theme', 'bootstrap');
			$('.select2me').select2({ placeholder: 'Select', width: 'auto', allowClear: true });
		}
	};

	// handle group element heights
	var handleHeight = function () {
		$('[data-auto-height]')
			.each(function () {
				var parent = $(this);
				var items = $('[data-height]', parent);
				var height = 0;
				var mode = parent.attr('data-mode');
				var offset = parseInt(parent.attr('data-offset')
					? parent.attr('data-offset')
					: 0);

				items.each(function () {
					if ($(this).attr('data-height') == 'height') {
						$(this).css('height', '');
					} else {
						$(this).css('min-height', '');
					}

					var height_ = (mode == 'base-height'
						? $(this).outerHeight()
						: $(this).outerHeight(true));
					if (height_ > height) {
						height = height_;
					}
				});

				height = height + offset;

				items.each(function () {
					if ($(this).attr('data-height') == 'height') {
						$(this).css('height', height);
					} else {
						$(this).css('min-height', height);
					}
				});

				if (parent.attr('data-related')) {
					$(parent.attr('data-related')).css('height', parent.height());
				}
			});
	};

	//* END:CORE HANDLERS *//

	return {

		//main function to initiate the theme
		init: function () {
			//IMPORTANT!!!: Do not modify the core handlers call order. Core handlers
			handleInit(); // initialize core variables
			handleOnResize(); // set and handle responsive

			//UI Component handlers
			handleMaterialDesign(); // handle material design
			handleiCheck(); // handles custom icheck radio and checkboxes
			handleBootstrapSwitch(); // handle bootstrap switch plugin
			handleScrollers(); // handles slim scrolling contents
			handleFancybox(); // handle fancy box
			handleSelect2(); // handle custom Select2 dropdowns
			handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
			handleAlerts(); //handle closabled alerts
			handleDropdowns(); // handle dropdowns
			handleTabs(); // handle tabs
			handleTooltips(); // handle bootstrap tooltips
			handlePopovers(); // handles bootstrap popovers
			handleAccordions(); //handles accordions
			handleModals(); // handle modals
			handleBootstrapConfirmation(); // handle bootstrap confirmations
			handleTextareaAutosize(); // handle autosize textareas
			handleCounterup(); // handle counterup instances

			//Handle group element heights
			this.addResizeHandler(handleHeight); // handle auto calculating height on window resize

			// Hacks
			handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
		},

		//main function to initiate core javascript after ajax complete
		initAjax: function () {
			//handleUniform(); // handles custom radio & checkboxes
			handleiCheck(); // handles custom icheck radio and checkboxes
			handleBootstrapSwitch(); // handle bootstrap switch plugin
			handleScrollers(); // handles slim scrolling contents
			handleSelect2(); // handle custom Select2 dropdowns
			handleFancybox(); // handle fancy box
			handleDropdowns(); // handle dropdowns
			handleTooltips(); // handle bootstrap tooltips
			handlePopovers(); // handles bootstrap popovers
			handleAccordions(); //handles accordions
			handleBootstrapConfirmation(); // handle bootstrap confirmations
		},

		//init main components
		initComponents: function () {
			this.initAjax();
		},

		// public function to remember last opened popover that needs to be closed on
		// click
		setLastPopedPopover: function (el) {
			lastPopedPopover = el;
		},

		// public function to add callback a function which will be called on window
		// resize
		addResizeHandler: function (func) {
			resizeHandlers.push(func);
		},

		//public functon to call _runresizeHandlers
		runResizeHandlers: function () {
			_runResizeHandlers();
		},

		// wrApper function to scroll(focus) to an element
		scrollTo: function (el, offeset) {
			var pos = (el && el.length > 0)
				? el
					.offset()
					.top
				: 0;

			if (el) {
				if ($('body').hasClass('page-header-fixed')) {
					pos = pos - $('.page-header').height();
				} else if ($('body').hasClass('page-header-top-fixed')) {
					pos = pos - $('.page-header-top').height();
				} else if ($('body').hasClass('page-header-menu-fixed')) {
					pos = pos - $('.page-header-menu').height();
				}
				pos = pos + (offeset
					? offeset
					: -1 * el.height());
			}

			$('html,body').animate({
				scrollTop: pos
			}, 'slow');
		},

		initSlimScroll: function (el) {
			if (!$().slimScroll) {
				return;
			}

			$(el)
				.each(function () {
					if ($(this).attr('data-initialized')) {
						return; // exit
					}

					var height;

					if ($(this).attr('data-height')) {
						height = $(this).attr('data-height');
					} else {
						height = $(this).css('height');
					}

					$(this).slimScroll({
						allowPageScroll: true, // allow page scroll when the element scroll is ended
						size: '7px',
						color: ($(this).attr('data-handle-color')
							? $(this).attr('data-handle-color')
							: '#bbb'),
						wrapperClass: ($(this).attr('data-wrapper-class')
							? $(this).attr('data-wrapper-class')
							: 'slimScrollDiv'),
						railColor: ($(this).attr('data-rail-color')
							? $(this).attr('data-rail-color')
							: '#eaeaea'),
						position: isRTL
							? 'left'
							: 'right',
						height: height,
						alwaysVisible: ($(this).attr('data-always-visible') == '1'
							? true
							: false),
						railVisible: ($(this).attr('data-rail-visible') == '1'
							? true
							: false),
						disableFadeOut: true
					});

					$(this).attr('data-initialized', '1');
				});
		},

		destroySlimScroll: function (el) {
			if (!$().slimScroll) {
				return;
			}

			$(el)
				.each(function () {
					if ($(this).attr('data-initialized') === '1') { // destroy existing instance before updating the height
						$(this).removeAttr('data-initialized');
						$(this).removeAttr('style');

						var attrList = {};

						// store the custom attribures so later we will reassign.
						if ($(this).attr('data-handle-color')) {
							attrList['data-handle-color'] = $(this).attr('data-handle-color');
						}
						if ($(this).attr('data-wrapper-class')) {
							attrList['data-wrapper-class'] = $(this).attr('data-wrapper-class');
						}
						if ($(this).attr('data-rail-color')) {
							attrList['data-rail-color'] = $(this).attr('data-rail-color');
						}
						if ($(this).attr('data-always-visible')) {
							attrList['data-always-visible'] = $(this).attr('data-always-visible');
						}
						if ($(this).attr('data-rail-visible')) {
							attrList['data-rail-visible'] = $(this).attr('data-rail-visible');
						}

						$(this).slimScroll({
							wrapperClass: ($(this).attr('data-wrapper-class')
								? $(this).attr('data-wrapper-class')
								: 'slimScrollDiv'),
							destroy: true
						});

						var the = $(this);

						// reassign custom attributes
						$.each(attrList, function (key, value) {
							the.attr(key, value);
						});

					}
				});
		},

		// function to scroll to the top
		scrollTop: function () {
			App.scrollTo();
		},

		// wrApper function to  block element(indicate loading)
		blockUI: function (options) {
			options = $.extend(true, {}, options);
			var html = '';
			if (options.animate) {
				html = '<div class="loading-message ' + (options.boxed
					? 'loading-message-boxed'
					: '') + '"><div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"' +
					'></div><div class="bounce3"></div></div></div>';
			} else if (options.iconOnly) {
				html = '<div class="loading-message ' + (options.boxed
					? 'loading-message-boxed'
					: '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
			} else if (options.textOnly) {
				html = '<div class="loading-message ' + (options.boxed
					? 'loading-message-boxed'
					: '') + '"><span>&nbsp;&nbsp;' + (options.message
					? options.message
					: 'LOADING...') + '</span></div>';
			} else {
				html = '<div class="loading-message ' + (options.boxed
					? 'loading-message-boxed'
					: '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message
					? options.message
					: 'LOADING...') + '</span></div>';
			}

			if (options.target) { // element blocking
				var el = $(options.target);
				if (el.height() <= ($(window).height())) {
					options.cenrerY = true;
				}
				el.block({
					message: html,
					baseZ: options.zIndex
						? options.zIndex
						: 1000,
					centerY: options.cenrerY !== undefined
						? options.cenrerY
						: false,
					css: {
						top: '10%',
						border: '0',
						padding: '0',
						backgroundColor: 'none'
					},
					overlayCSS: {
						backgroundColor: options.overlayColor
							? options.overlayColor
							: '#555',
						opacity: options.boxed
							? 0.05
							: 0.1,
						cursor: 'wait'
					}
				});
			} else { // page blocking
				$.blockUI({
					message: html,
					baseZ: options.zIndex
						? options.zIndex
						: 1000,
					css: {
						border: '0',
						padding: '0',
						backgroundColor: 'none'
					},
					overlayCSS: {
						backgroundColor: options.overlayColor
							? options.overlayColor
							: '#555',
						opacity: options.boxed
							? 0.05
							: 0.1,
						cursor: 'wait'
					}
				});
			}
		},

		// wrApper function to  un-block element(finish loading)
		unblockUI: function (target) {
			if (target) {
				$(target).unblock({
					onUnblock: function () {
						$(target).css('position', '');
						$(target).css('zoom', '');
					}
				});
			} else {
				$.unblockUI();
			}
		},

		startPageLoading: function (options) {
			if (options && options.animate) {
				$('.page-spinner-bar').remove();
				$('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></' +
					'div><div class="bounce3"></div></div>');
			} else {
				$('.page-loading').remove();
				$('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message
					? options.message
					: 'Loading...') + '</span></div>');
			}
		},

		stopPageLoading: function () {
			$('.page-loading, .page-spinner-bar').remove();
		},

		alert: function (options) {

			options = $.extend(true, {
				container: '', // alerts parent container(by default placed after the page breadcrumbs)
				place: 'append', // "append" or "prepend" in container
				type: 'success', // alert's type
				message: '', // alert's message
				close: true, // make alert closable
				reset: true, // close all previouse alerts first
				focus: true, // auto scroll to the alert after shown
				closeInSeconds: 0, // auto close after defined seconds
				icon: '' // put icon before the message
			}, options);

			var id = App.getUniqueID('App_alert');

			var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close
				? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></bu' +
				'tton>'
				: '') + (options.icon !== ''
				? '<i class="fa-lg fa fa-' + options.icon + '"></i>  '
				: '') + options.message + '</div>';

			if (options.reset) {
				$('.custom-alerts').remove();
			}

			if (!options.container) {
				if ($('.page-fixed-main-content').length === 1) {
					$('.page-fixed-main-content').prepend(html);
				} else if (($('body').hasClass('page-container-bg-solid') || $('body').hasClass('page-content-white')) && $('.page-head').length === 0) {
					$('.page-title').after(html);
				} else {
					if ($('.page-bar').length > 0) {
						$('.page-bar').after(html);
					} else {
						$('.page-breadcrumb, .breadcrumbs').after(html);
					}
				}
			} else {
				if (options.place == 'append') {
					$(options.container).append(html);
				} else {
					$(options.container).prepend(html);
				}
			}

			if (options.focus) {
				App.scrollTo($('#' + id));
			}

			if (options.closeInSeconds > 0) {
				setTimeout(function () {
					$('#' + id).remove();
				}, options.closeInSeconds * 1000);
			}

			return id;
		},

		//public function to initialize the fancybox plugin
		initFancybox: function () {
			handleFancybox();
		},

		// public helper function to get actual input value(used in IE9 and IE8 due to
		// placeholder attribute not supported)
		getActualVal: function (el) {
			el = $(el);
			if (el.val() === el.attr('placeholder')) {
				return '';
			}
			return el.val();
		},

		//public function to get a paremeter by name from URL
		getURLParameter: function (paramName) {
			var searchString = window
					.location
					.search
					.substring(1),
				i,
				val,
				params = searchString.split('&');

			for (i = 0; i < params.length; i++) {
				val = params[i].split('=');
				if (val[0] == paramName) {
					return unescape(val[1]);
				}
			}
			return null;
		},

		// check for device touch support
		isTouchDevice: function () {
			try {
				document.createEvent('TouchEvent');
				return true;
			} catch (e) {
				return false;
			}
		},

		// To get the correct viewport width based on
		// http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
		getViewPort: function () {
			var e = window,
				a = 'inner';
			if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}

			return {
				width: e[a + 'Width'],
				height: e[a + 'Height']
			};
		},

		getUniqueID: function (prefix) {
			return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
		},

		// check IE8 mode
		isIE8: function () {
			return isIE8;
		},

		// check IE9 mode
		isIE9: function () {
			return isIE9;
		},

		//check RTL mode
		isRTL: function () {
			return isRTL;
		},

		// check IE8 mode
		isAngularJsApp: function () {
			return (typeof angular == 'undefined')
				? false
				: true;
		},

		getAssetsPath: function () {
			return assetsPath;
		},

		setAssetsPath: function (path) {
			assetsPath = path;
		},

		setGlobalImgPath: function (path) {
			globalImgPath = path;
		},

		getGlobalImgPath: function () {
			return assetsPath + globalImgPath;
		},

		setGlobalPluginsPath: function (path) {
			globalPluginsPath = path;
		},

		getGlobalPluginsPath: function () {
			return assetsPath + globalPluginsPath;
		},

		getGlobalCssPath: function () {
			return assetsPath + globalCssPath;
		},

		// get layout color code by color name
		getBrandColor: function (name) {
			if (brandColors[name]) {
				return brandColors[name];
			} else {
				return '';
			}
		},

		getResponsiveBreakpoint: function (size) {
			// bootstrap responsive breakpoints
			var sizes = {
				'xs': 480, // extra small
				'sm': 768, // small
				'md': 992, // medium
				'lg': 1200 // large
			};

			return sizes[size]
				? sizes[size]
				: 0;
		}
	};

}();

/**
Core script to handle the entire theme and core functions
**/
export const Layout = function () {

	var layoutImgPath = 'layouts/layout6/img/';

	var layoutCssPath = 'layouts/layout6/css/';

	var resBreakpointMd = App.getResponsiveBreakpoint('md'); //992px
	var resBreakpointSm = App.getResponsiveBreakpoint('sm'); //768px

	var handleQuickSearch = function () {
		// handle search box expand/collapse
		$('.page-header')
			.on('click', '.search-form', function (e) {
				$(this).addClass('open');
				$(this)
					.find('.form-control')
					.focus();

				$('.page-header .search-form .form-control').on('blur', function (e) {
					$(this)
						.closest('.search-form')
						.removeClass('open');
					$(this).unbind('blur');
				});
			});

		// handle hor menu search form on enter press
		$('.page-header').on('keypress', '.hor-menu .search-form .form-control', function (e) {
			if (e.which == 13) {
				$(this)
					.closest('.search-form')
					.submit();
				return false;
			}
		});

		// handle header search button click
		$('.page-header').on('mousedown', '.search-form.open .submit', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this)
				.closest('.search-form')
				.submit();
		});
	};

	// handle go to top button
	var handleGo2Top = function () {
		var Go2TopOperation = function () {
			var CurrentWindowPosition = $(window).scrollTop(); // current vertical position
			if (CurrentWindowPosition > 100) {
				$('.go2top').show();
			} else {
				$('.go2top').hide();
			}
		};

		Go2TopOperation(); // call headerFix() when the page was loaded
		if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
			$(window)
				.bind('touchend touchcancel touchleave', function (e) {
					Go2TopOperation();
				});
		} else {
			$(window)
				.scroll(function () {
					Go2TopOperation();
				});
		}

		$('.go2top')
			.click(function (e) {
				e.preventDefault();
				$('html, body').animate({
					scrollTop: 0
				}, 600);
			});
	};

	// Handle sidebar menu
	var handleSidebarMenu = function () {
		$('.page-sidebar')
			.on('click', 'li > a', function (e) {

				if (App.getViewPort().width >= resBreakpointMd && $(this).parents('.page-sidebar-menu-hover-submenu').length === 1) { // exit of hover sidebar menu
					return;
				}

				if ($(this).next().hasClass('sub-menu') === false) {
					if (App.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass('in')) { // close the menu on mobile view while laoding a page
						$('.page-header .responsive-toggler').click();
					}
					return;
				}

				var parent = $(this)
					.parent()
					.parent();
				var the = $(this);
				var menu = $('.page-sidebar-menu');
				var sub = $(this).next();

				var autoScroll = menu.data('auto-scroll');
				var slideSpeed = parseInt(menu.data('slide-speed'));
				var keepExpand = menu.data('keep-expanded');

				if (keepExpand !== true) {
					parent
						.children('li.open')
						.children('a')
						.children('.arrow')
						.removeClass('open');
					parent
						.children('li.open')
						.children('.sub-menu:not(.always-open)')
						.slideUp(slideSpeed);
					parent
						.children('li.open')
						.removeClass('open');
				}

				var slideOffeset = -200;

				if (sub.is(':visible')) {
					$('.arrow', $(this)).removeClass('open');
					$(this)
						.parent()
						.removeClass('open');
					sub.slideUp(slideSpeed, function () {
						if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
							if ($('body').hasClass('page-sidebar-fixed')) {
								menu.slimScroll({
									'scrollTo': (the.position()).top
								});
							} else {
								App.scrollTo(the, slideOffeset);
							}
						}
					});
				} else {
					$('.arrow', $(this)).addClass('open');
					$(this)
						.parent()
						.addClass('open');
					sub.slideDown(slideSpeed, function () {
						if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
							if ($('body').hasClass('page-sidebar-fixed')) {
								menu.slimScroll({
									'scrollTo': (the.position()).top
								});
							} else {
								App.scrollTo(the, slideOffeset);
							}
						}
					});
				}

				e.preventDefault();
			});

		// handle ajax links within sidebar menu
		$('.page-sidebar').on('click', ' li > a.ajaxify', function (e) {
			e.preventDefault();
			App.scrollTop();

			var url = $(this).attr('href');
			var menuContainer = $('.page-sidebar ul');
			var pageContent = $('.page-content');
			var pageContentBody = $('.page-content .page-content-body');

			menuContainer
				.children('li.active')
				.removeClass('active');
			menuContainer
				.children('arrow.open')
				.removeClass('open');

			$(this)
				.parents('li')
				.each(function () {
					$(this).addClass('active');
					$(this)
						.children('a > span.arrow')
						.addClass('open');
				});
			$(this)
				.parents('li')
				.addClass('active');

			if (App.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass('in')) { // close the menu on mobile view while laoding a page
				$('.page-header .responsive-toggler').click();
			}

			App.startPageLoading();

			var the = $(this);

			$.ajax({
				type: 'GET',
				cache: false,
				url: url,
				dataType: 'html',
				success: function (res) {

					if (the.parents('li.open').length === 0) {
						$('.page-sidebar-menu > li.open > a').click();
					}

					App.stopPageLoading();
					pageContentBody.html(res);
					Layout.fixContentHeight(); // fix content height
					App.initAjax(); // initialize core stuff
				},
				error: function (xhr, ajaxOptions, thrownError) {
					App.stopPageLoading();
					pageContentBody.html('<h4>Could not load the requested content.</h4>');
				}
			});
		});

		// handle ajax link within main content
		$('.page-content').on('click', '.ajaxify', function (e) {
			e.preventDefault();
			App.scrollTop();

			var url = $(this).attr('href');
			var pageContent = $('.page-content');
			var pageContentBody = $('.page-content .page-content-body');

			App.startPageLoading();

			if (App.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass('in')) { // close the menu on mobile view while laoding a page
				$('.page-header .responsive-toggler').click();
			}

			$.ajax({
				type: 'GET',
				cache: false,
				url: url,
				dataType: 'html',
				success: function (res) {
					App.stopPageLoading();
					pageContentBody.html(res);
					Layout.fixContentHeight(); // fix content height
					App.initAjax(); // initialize core stuff
				},
				error: function (xhr, ajaxOptions, thrownError) {
					pageContentBody.html('<h4>Could not load the requested content.</h4>');
					App.stopPageLoading();
				}
			});
		});

		// handle scrolling to top on responsive menu toggler click when header is fixed
		// for mobile view
		$(document).on('click', '.page-header-fixed-mobile .responsive-toggler', function () {
			App.scrollTop();
		});
	};

	return {

		// Main init methods to initialize the layout IMPORTANT!!!: Do not modify the
		// core handlers call order.

		init: function () {
			handleQuickSearch();
			handleGo2Top();
			handleSidebarMenu();
		},

		getLayoutImgPath: function () {
			return App.getAssetsPath() + layoutImgPath;
		},

		getLayoutCssPath: function () {
			return App.getAssetsPath() + layoutCssPath;
		}
	};

}();

export const FormValidationMd = function () {

	var handleLogin = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#loginForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input
			rules: {
				email: {
					required: true,
					email: true
				},
				password: {
					required: true
				},

			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var handleCreateOpportunity = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var submitted = false;
		var form1 = jQuery('#createOpportunityOne');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');
		jQuery.validator.addMethod('validurl', function (value, element) {
			return this.optional(element) || /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm.test(value);
		}, 'Please enter a valid web address');
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				sourcedetail: {
					not_allow_no: true
				},
				opp_title: {
					required: true,
					not_allow_no: true
				},
				opp_no: {
					required: true,
					number: true
				},
				category: {
					selectcheck: true,
				},
				department: {
					selectcheck: true,
				},
				sales_rep: {
					selectcheck: true
				},
				company: {
					// required: true
				},
				individual: {
					// required: true
				},
				date: {
					required: true,
					// date:true
				},
				description: {
					required: true,
					not_allow_no: true
				},
				estimated_close_date: {
					required: true,
					// date:true
				},
				actual_close_date: {
					required: true,
					// date:true
				},
				value: {
					required: true
				},
				weighted: {
					required: true,
					number: true
				},
				days_open: {
					required: true,
					number: true
				},
				phone: {
					number: true,
					minlength: 10,
					maxlength: 10
				},
				internet: {
					email: true
				}
			},
			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},
			showErrors: function (errorMap, errorList) {
				if (submitted) {
					var summary = 'You have the following errors: <br/>';
					$.each(errorList, function () {
						summary += this.element.name + ': ' + this.message + '<br/>';
					});
					// toastr.error(summary);
					$('div.validation_summary').html('' + summary + '');
					// alert(summary);
					submitted = false;
					// error1.show();
				}
				this.defaultShowErrors();
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
				submitted = true;

				// 'this' refers to the form
				// var errors = validator.numberOfInvalids();
				// if (errors) {
				//     var message = errors == 1
				//         ? 'You missed 1 field. It has been highlighted'
				//         : 'You missed ' + errors + ' fields. They have been highlighted';
				//     $("div.alert button").html(message);
				//     error1.show();
				// } else {
				//     error1.hide();
				// }
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateOtherContact = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#add_other_contact');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				first_name: {
					lettersonly: true,
					required: true,
					spaceValidation: true
				},
				last_name: {
					lettersonly: true,
					required: true,
					spaceValidation: true
				},
				new_email: {
					// required: true,
					email: true
				},
				new_phone: {
					// required: true,
					// minlength: 10,
					// maxlength: 10
				}
			},

			messages: {
				phone: {
					checkLength: 'Please enter a valid phone number'
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};


	var handleCreateProposalContact = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#add_proposal_contact');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				first_name: {
					lettersonly: true,
					required: true,
					spaceValidation: true
				},
				last_name: {
					lettersonly: true,
					required: true,
					spaceValidation: true
				},
				new_email: {
					// required: true,
					email: true
				},
				new_phone: {
					// required: true,
					// minlength: 10,
					// maxlength: 10
				}
			},

			messages: {
				phone: {
					checkLength: 'Please enter a valid phone number'
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleAddressModal = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#validateAdd');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		jQuery.validator.addMethod('allowHash', function (value, element) {
			return this.optional(element) || /^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-,# ])*$/i.test(value);
		}, 'Please enter valid characters.');

		jQuery.validator.addMethod('item_name_validate', function (value, element) {
			return this.optional(element) || /^[a-zA-Z0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?,]+(\s{0,1}[a-zA-Z0-9\s\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?, ])*$/i.test(value);
		}, 'Please enter valid characters.');

		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				address1: {
					not_allow_no: true,
					// allowHash: true,
					required: true
				},
				address2: {
					not_allow_no: true,
					// allowHash: true,
				},
				addCity: {
					not_allow_no: true,
					// spaceValidation: true,
					required: true
				},
				addState: {
					not_allow_no: true,
					// spaceValidation: true,
					required: true
				},
				addZip: {
					digits: true,
					maxlength: 5,
					minlength: 4,
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				// App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};

	var handleCreateContact = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createContact');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		jQuery.validator.addMethod('validurl', function (value, element) {
			return this.optional(element) || /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm.test(value);
		}, 'Please enter a valid web address');

		jQuery.validator.addMethod('company_name_validate', function (value, element) {
			return this.optional(element) || /^[a-zA-Z0-9-_.,?@&#!'~*+;][a-zA-Z0-9-_.,?@&#!'~*+; ]+$/i.test(value);

		}, 'Invalid character for company name');

		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');

		jQuery.validator.addMethod('noSpace', function (value, element) {
			return value.trim().length != 0;
		}, 'This field is required');

		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');

		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
		}, 'Letters only please');

		jQuery.validator.addMethod('checkLength', function (value, element) {

			var temp = value;
			var ktp = temp.replace(/[^a-z\d\s]+/gi, '');
			var KTP1 = ktp.replace(/ /g, '');

			if (KTP1.length < 10 && KTP1.length > 0) {
				return false;
			}
			else if (KTP1 == '') {
				return true;
			}
			else {
				return true;
			}
		});
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				comp_Name: {
					// noSpace: true,
					company_name_validate: true,
					not_allow_no: true
				},
				// usr_Title: {
				// 	lettersonly: true
				// },
				firstname: {
					required: true,
					// spaceValidation: true
					// not_allow_no: true,
					lettersonly:true

				},
				lastname: {
					required: true,
					// spaceValidation: true
					// not_allow_no: true
					lettersonly:true

				},
				usrNickname: {
					// spaceValidation: true
					not_allow_no: true

				},
				usr_Title: {
					// spaceValidation: true
					not_allow_no: true

				},
				webAddress: {
					validurl: true
				},
				phone: {
					checkLength: true
				},
				mail: {
					email: true
				},
				address1: {
					// spaceValidation: true
					not_allow_no: true
				},
				address2: {
					// spaceValidation: true
					not_allow_no: true
				},
				addState: {
					not_allow_no: true
				},
				addCity: {
					not_allow_no: true
				},
				addZip: {
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				contactFileUpload: {
					accept: 'image/*'
				},
				contactType: {
					selectcheck: true
				},
				contactStatus: {
					selectcheck: true
				},
				contactSource: {
					selectcheck: true
				}
			},

			messages: {
				phone: {
					checkLength: 'Please enter a valid phone number'
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};

	var handleAddOtherStatusType = function () {
		var form1 = jQuery('#addOtherStatusType');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				add_value: {
					required: true,
					lettersonly: true,
					// spaceValidation: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var handleAddOtherProjectType = function () {
		var form1 = jQuery('#addOtherProjectType');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				add_value: {
					required: true,
					// spaceValidation: true,
					not_allow_no: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var handleUpdateContact = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#update_form');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		jQuery.validator.addMethod('noSpace', function (value, element) {
			return value.trim().length != 0;
		}, 'This field is required');

		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This Field is required');



		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				compName: {
					noSpace: true,
					company_name_validate: true
				},
				usr_Title: {
					spaceValidation: true,
				},
				firstname: {
					required: true,
					lettersonly: true,
					spaceValidation: true
				},
				lastname: {
					required: true,
					lettersonly: true,
					spaceValidation: true
				},
				usrNickname: {
					spaceValidation: true
				},
				webAddress: {
					validurl: true,
				},
				phone: {
					checkLength: true
				},
				mail: {
					email: true
				},
				address1: {
					spaceValidation: true
				},
				address2: {
					spaceValidation: true
				},
				addState: {
					// lettersonly: true
				},
				addCity: {
					// lettersonly: true
				},
				addZip: {
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				contactFileUpload: {
					accept: 'image/*'
				},
				contactType: {
					selectcheck: true
				},
				contactStatus: {
					selectcheck: true
				},
				contactSource: {
					selectcheck: true
				},
			},

			messages: {
				phone: {
					checkLength: 'Please enter a valid phone number'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateEstimate = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		//         jQuery.validator.setDefaults({
		//             ignore: ":hidden:not(#summernote),.summernote"
		// });
		var form1 = jQuery('#createEstimate');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '',
			rules: {
				billAdd1: {
					// required: true,
					// all_special_characters: true
					not_allow_no: true
				},
				billAdd2: {
					// all_special_characters: true
					not_allow_no: true
				},
				billCity: {
					// all_special_characters: true
					not_allow_no: true
				},
				billState: {
					// required: true,
					// lettersonly: true,
					// all_special_characters: true
					not_allow_no: true
				},
				billZip: {
					// required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				// proposed_services: {
				//     required: true
				// },
				// opportunity: {
				//     selectcheck: true
				// },
				shipAdd1: {
					// all_special_characters: true,
					not_allow_no: true
				},
				shipAdd2: {
					// all_special_characters: true,
					not_allow_no: true
				},
				shipCity: {
					// all_special_characters: true
					not_allow_no: true
				},
				shipState: {
					// all_special_characters: true
					not_allow_no: true
				},
				shipZip: {
					digits: true,
					minlength: 5,
					maxlength: 5
				},
				defaultMarkup: {
					positiveNumber: true
				},
				taxRate: {
					positiveNumber: true
				},
				name: {
					required: true,
					not_allow_no: true
				},
				note: {
					not_allow_no: true
				},
				// proposal: {
				//     selectcheck: true
				// },
				// project: {
				//     selectcheck: true
				// },
				memo: {
					lettersonly: true
				},
				stageType: {
					required: true,
					selectcheck: true
				},
				classType: {
					required: true,
					selectcheck: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var handleEstimateWithName = function () {
		var form1 = jQuery('#estimateName');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '',
			rules: {
				ename: {
					required: true,
					not_allow_no: true
					// spaceValidation: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreatePos = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createPOs');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('spaceValidation', function (value, element) {
			return this.optional(element) || /^[a-zA-Z,]+(\s{0,1}[a-zA-Z, ])*$/i.test(value);
		}, 'Please enter valid characters.');

		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '',
			rules: {
				vendor: {
					required: true,
					// all_special_characters: true
					not_allow_no: true
				},
				vendorAddress1: {
					required: true,
					// all_special_characters: true
					not_allow_no: true
				},
				vendorAddress2: {
					// all_special_characters: true
					not_allow_no: true
				},
				vendorCity: {
					required: true,
					// spaceValidation: true
					not_allow_no: true
				},
				vendorState: {
					required: true,
					// spaceValidation: true
					not_allow_no: true

				},
				vendorZip: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				shippingAddress1: {
					required: true,
					// all_special_characters: true
					not_allow_no: true

				},
				shippingAddress2: {
					not_allow_no: true
					// all_special_characters: true
				},
				shippingCity: {
					required: true,
					not_allow_no: true

				},
				shippingState: {
					required: true,
					not_allow_no: true
				},
				shippingZip: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				createDate: {
					required: true
				},
				shipDate: {
					required: true
				},
				title: {
					required: true,
					// all_special_characters: true
					not_allow_no: true

				},
				tracking: {
					// required: true,
					all_special_characters: true,
					maxlength: 50
				},
				uponReceipt: {
					required: true,
					spaceValidation: true
				},
				notes: {
					// all_special_characters: true
					not_allow_no: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var handleUpdateEstimate = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#updateEstimate');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '',
			rules: {
				billAdd1: {
					required: true,
					all_special_characters: true
				},
				billAdd2: {
					all_special_characters: true
				},
				billCity: {
					required: true,
					// lettersonly: true
				},
				billState: {
					required: true,
					// lettersonly: true
				},
				billZip: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				proposal: {
					lettersonly: true
				},
				project: {
					lettersonly: true
				},
				memo: {
					lettersonly: true
				},
				stageType: {
					required: true,
					selectcheck: true
				},
				classType: {
					required: true,
					selectcheck: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var handleCreateProposal = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createProposal');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('spaceAndLetter', function (value, element) {
			return this.optional(element) || /^[a-zA-Z,]+(\s{0,1}[a-zA-Z, ])*$/i.test(value);
		}, 'Please enter valid characters.');
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span',//default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false,// do not focus the last invalid input
			ignore: '',// validate all fields including form hidden input

			rules: {
				customer: {
					required: true
				},
				individual: {
					required: true
				},
				projectName: {
					not_allow_no: true
					// spaceAndLetter:true
				},
				projectLocation: {
					not_allow_no: true
				},
				summary: {
					not_allow_no: true
				},
				note: {
					not_allow_no: true
				},
				salesperson: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateProject = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createProject');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				title: {
					required: true,
					not_allow_no: true
				},
				description: {
					not_allow_no: true
				},
				category: {
					selectcheck: true,
					required: true
				},
				department: {
					selectcheck: true,
					required: true
				},
				startDate: {
					required: true
				},
				endDate: {
					required: true
				},
				projectRate: {
					required: true
				},
				percentComplete: {
					min: 0,
					max: 100
				}
			},
			messages: {
				percentComplete: {
					min: 'Please enter a value between 0 and 100',
					max: 'Please enter a value between 0 and 100'
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateOrder = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createOrder');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');

		jQuery.validator.addMethod('positiveNumber', function (value, element) {
			return this.optional(element) || /^[0-9]*\.?[0-9]+$/i.test(value);
		}, 'Please enter a valid positive number.');
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				customer: {
					// required: true
				},
				title: {
					required: true,
					all_special_characters: true
				},
				billingAddress1: {
					required: true,
					spaceValidation: true
				},
				billingAddress2: {
					spaceValidation: true
				},
				billingCity: {
					required: true,
					lettersonly: true,
					spaceValidation: true
				},
				billingState: {
					required: true,
					lettersonly: true,
					spaceValidation: true
				},
				billingZip: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				shippingAddress1: {
					// required: true,
					spaceValidation: true
				},
				shippingAddress2: {
					spaceValidation: true
				},
				shippingCity: {
					// required: true,
					spaceValidation: true
				},
				shippingState: {
					// required: true,
					spaceValidation: true
				},
				shippingZip: {
					// required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				description: {
					required: true,
					// all_special_characters: true
					not_allow_no: true
				},
				serviceLocation: {
					// all_special_characters: true
					not_allow_no: true
				},
				workPerform: {
					all_special_characters: true
				},
				estimatedDuration: {
					positiveNumber: true
				},
				defaultMarkup: {
					positiveNumber: true
				},
				taxRate: {
					positiveNumber: true
				},
				status: {
					required: true
				},
				stage: {
					required: true
				},
				salesRep: {
					required: true
				},
				orderType: {
					selectcheck: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};

	var handleCreateOrderMore = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createOrderMoreInfo');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		jQuery.validator.addMethod('checkLength', function (value, element) {

			var temp = value;
			var ktp = temp.replace(/[^a-z\d\s]+/gi, '');
			var KTP1 = ktp.replace(/ /g, '');

			if (KTP1.length < 10 && KTP1.length > 0) {
				return false;
			}
			else if (KTP1 == '') {
				return true;
			}
			else {
				return true;
			}
		});
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				techName: {
					required: true,
					alphanumericsonly: true
				},
				techPhone: {
					required: true,
					checkLength: true
				},
				notes: {
					required: true
				}

			},

			messages: {
				techPhone: {
					checkLength: 'Please enter a valid phone number'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateInvoice = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createInvoice');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				title: {
					required: true
				},
				billingAddress1: {
					required: true,
					spaceValidation: true
				},
				billingAddress2: {
					spaceValidation: true
				},
				billingCity: {
					required: true,
					lettersonly: true
				},
				billingState: {
					required: true,
					lettersonly: true
				},
				billingZip: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				shippingAddress1: {
					required: true,
					spaceValidation: true
				},
				shippingAddress2: {
					spaceValidation: true
				},
				shippingCity: {
					required: true,
					lettersonly: true
				},
				shippingState: {
					required: true,
					lettersonly: true
				},
				shippingZip: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 5
				},
				dueDate: {
					required: true
				},
				terms: {
					selectcheck: true
				},
				class: {
					selectcheck: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateItem = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createItem');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {

				item_name: {
					required: true,
					all_special_characters: true
				},
				item_modalNo: {
					required: true,
					all_special_characters: true
				},
				item_partNo: {
					all_special_characters: true
				},
				item_manufacturer: {
					required: true,
					// lettersonly: true,
					// spaceValidation: true
					all_special_characters: true
				},
				category: {
					// required: true,
					lettersonly: true,
					spaceValidation: true
				},
				labourHrs: {
					positiveNumber: true
				},
				mfgWarranty: {
					spaceValidation: true
				},
				series: {
					spaceValidation: true
				},
				item_description: {
					// all_special_characters: true
					not_allow_no: true
				},
				item_notes: {
					// all_special_characters: true
					not_allow_no: true
				},
				// listPrice: {
				//     required: true
				// },
				// dealerPrice: {
				//     required: true
				// },
				supplierName: {
					// lettersonly: true
					not_allow_no: true
				},
				mfgUrl: {
					validurl: true
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateWorklog = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createWorklog');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				// project: {
				// 	required: true
				// },
				status: {
					required: true,
					// date : true,
				}, startDateTime: {
					required: true,
					// date : true,
				},
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateTimer = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createTimer');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				user: {
					required: true
				},
				project: {
					required: true
				},
				startDateTime: {
					required: true,
					// date : true,
				},
				endDateTime: {
					required: true,
					// date : true,
				},
				totalHr: {
					required: true
				},
				description: {
					required: true
				},
				contact: {
					required: true,
					number: true,
					minlength: 10,
					maxlength: 10
				},
				projectItem: {
					required: true
				},
				wageRate: {
					number: true,
					required: true
				},
				empApproved: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateDocument = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createDocument');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				client: {
					required: true
				},
				project: {
					required: true
				},
				opportunity: {
					required: true
				},
				estimate: {
					required: true,
				},
				order: {
					required: true
				},
				purchaseOrder: {
					required: true
				},
				description: {
					required: true,
				},
				docType: {
					selectcheck: true
				},
				docCategory: {
					selectcheck: true
				},
				version: {
					// required: true
				},
				refNumber: {
					// required: true
				},
				location: {
					// required: true
				},
				fileName: {
					required: true
				},
				authorName: {
					// required: true
				},
				pages: {
					required: true,
					number: true,
				},
				keywords: {
					required: true
				},
				docTitle: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateDaily = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createDaily');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				dailyProduction: {
					required: true,
					alphanumericsonly: true
				},
				problems: {
					required: true,
					alphanumericsonly: true
				},
				workPlan: {
					required: true,
					alphanumericsonly: true
				},
				resolution: {
					required: true,
					alphanumericsonly: true
				},
				onSiteTeamMember: {
					alphanumericsonly: true
				},
				notes: {
					alphanumericsonly: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var validatePhone = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#phone');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);



		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {

			},

			messages: {

			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var validateMail = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#mail');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				mail: {
					email: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	var validateAddress1 = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#address1');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				address1: {
					alphanumericsonly: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var validateAddress2 = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#address2');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				address2: {
					alphanumericsonly: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var validateCity = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#addCity');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				addCity: {
					lettersonly: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var validateState = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#addState');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				addState: {
					lettersonly: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var validateZip = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#addZip');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				addZip: {
					digits: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateNote = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createNote');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				noteSubject: {
					required: true,
					alphanumericsonly: true
				},
				category: {
					selectcheck: true,
				},
				description: {
					required: true,
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateTask = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createTask');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				taskSubject: {
					required: true,
					alphanumericsonly: true
				},
				category: {
					selectcheck: true,
				},
				description: {
					required: true,
				},
				endDateTime: {
					required: true
				},
				reminderDateTime: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateEvent = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createEvent');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				eventName: {
					required: true,
					alphanumericsonly: true
				},
				category: {
					selectcheck: true,
				},
				notes: {
					required: true,
				},
				endDateTime: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateCall = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createCall');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				subject: {
					required: true,
					alphanumericsonly: true
				},
				description: {
					required: true,
				},
				endDateTime: {
					required: true
				},
				result: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateLetter = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createLetter');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				subject: {
					required: true,
					alphanumericsonly: true
				},
				description: {
					required: true,
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateFax = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createFax');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				subject: {
					required: true,
					alphanumericsonly: true
				},
				description: {
					required: true,
				},
				pages: {
					required: true,
					number: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateEmail = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createEmail');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				email_from: {
					required: true,
					email: true
				},
				email_to: {
					required: true,
					email: true
				},
				email_cc: {
					// required: true,
					email: true
				},
				email_bcc: {
					// required: true,
					email: true
				},
				description: {
					required: true
				},
				subject: {
					required: true,
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleUpdateUser = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#userUpdateForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				firstname: {
					required: true,
					lettersonly: true
				},
				lastname: {
					lettersonly: true
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateExpense = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#createExpense');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				amount: {
					required: true
				},
				description: {
					required: true,
					alphanumericsonly: true
				},
				purchasedAt: {
					required: true,
					lettersonly: true
				},
				cclast: {
					required: true,
					number: true,
					minlength: 4,
					maxlength: 4
				},
				notes: {
					required: true,
					lettersonly: true
				},
				enteredOn: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	var handleCreateOtherItem = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#add_other_item');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');
		jQuery.validator.addMethod('selectcheck', function (value) {
			return (value != '0');
		}, 'This field is required');
		jQuery.validator.addMethod('item_name_validate', function (value, element) {
			return this.optional(element) || /^[a-zA-Z0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?,]+(\s{0,1}[a-zA-Z0-9\s\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?, ])*$/i.test(value);
		}, 'Please enter valid characters.');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {

				item_name: {
					required: true,
					item_name_validate: true
				},
				item_modalNo: {
					required: true,
					item_name_validate: true
				},
				item_manufacturer: {
					required: true,
					item_name_validate: true
					// spaceValidation: true
					// lettersonly: true
				},
				item_partNo: {
					required: true,
					item_name_validate: true
				},
				listPrice: {
					required: true,
				},
				dealerPrice: {
					required: true,
				},
				supplierName: {
					required: true,
					// lettersonly: true,
					// spaceValidation: true
				},

			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) {
				// hightlight error inputs
				jQuery(element)
					.closest('.form-group')
					.addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) {
				// revert the change done by hightlight
				jQuery(element)
					.closest('.form-group')
					.removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group')
					.removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});

	};
	//user management tab's 
	var handleInviteUserEditValidation = function () {

		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form6 = jQuery('#inviteUserEditForm');
		var error6 = jQuery('.alert-danger', form6);
		var success6 = jQuery('.alert-success', form6);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');
		form6.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				firstname: {
					required: true,
					lettersonly: true
				},
				lastname: {
					required: true,
					lettersonly: true
				},
				email: {
					required: true,
					email: true
				},
				phone: {
					minlength: 14,
					maxlength: 14,
					required: true
				},
				status: {
					required: true
				},
				location: {
					not_allow_no: true
				},
				role: {
					required: true
				},
				about: {
					not_allow_no: true
				},
			},
			messages: {
				phone: {
					minlength: 'Minimum 10 digit',
					maxlength: 'Maximum 10 digit'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success6.hide();
				error6.show();
				App.scrollTo(error6, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs

				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success6.show();
				error6.hide();
			}
		});
	};

	var handleInviteUserValidation = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form6 = jQuery('#inviteUserForm');
		var error6 = jQuery('.alert-danger', form6);
		var success6 = jQuery('.alert-success', form6);
		jQuery.validator.addMethod('letterAndSpace', function (value, element) {
			return this.optional(element) || /^[a-zA-Z,]+(\s{0,1}[a-zA-Z, ])*$/i.test(value);
		}, 'Please enter valid characters.');
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('mail', function (value, element) {
			return this.optional(element) || /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(value);
		}, 'Please enter a valid email address.');
		form6.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				firstname: {
					required: true,
					// lettersonly: true,
					letterAndSpace: true,
					maxlength: 80,
				},
				lastname: {
					required: true,
					// lettersonly: true,
					letterAndSpace: true,
					maxlength: 80,
				},
				email: {
					required: true,
					mail: true,
					maxlength: 80,
				},
				role: {
					required: true
				}
			},

			messages: {
				email: {
					remote: 'Email not allowed'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success6.hide();
				error6.show();
				App.scrollTo(error6, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs

				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success6.show();
				error6.hide();
			}
		});
	};

	var handleNewAccountValidation = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form6 = jQuery('#newAccountForm');
		var error6 = jQuery('.alert-danger', form6);
		var success6 = jQuery('.alert-success', form6);
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_\s-]+$/i.test(value);

		}, 'Only alphanumeric\'s and spaces only');
		form6.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				accountname: {
					minlength: 2,
					required: true,
					alphanumericsonly: true,
					remote: function () {
						var c = {
							type: 'POST',
							url: api.COMPANY_EXIST,
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify({ companyName: jQuery('#accountname').val() })
						};
						return c;

					},

				},
				remembercheck: {
					required: true
				}
			},
			messages: {
				accountname: {
					remote: 'Account name already taken'
				},
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success6.hide();
				error6.show();
				App.scrollTo(error6, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs

				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success6.show();
				error6.hide();
			}
		});
	};

	var handleProfileUpdateValidation = function () {

		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form6 = jQuery('#profileUpdateForm');
		var error6 = jQuery('.alert-danger', form6);
		var success6 = jQuery('.alert-success', form6);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /^[^-\s][a-zA-Z0-9_.\s-]+$/i.test(value);

		}, 'Alphanumeric\'s and spaces only');
		form6.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				firstname: {
					required: true,
					lettersonly: true
				},
				lastname: {
					required: true,
					lettersonly: true
				},
				email: {
					required: true,
					email: true
				},
				phone: {
					minlength: 12,
					maxlength: 12
				},
				location: {
					alphanumericsonly: true
				},
				about: {
					alphanumericsonly: true
				},
				userFileUpload: {
					accept: 'image/*'
				}
			},

			messages: {
				phone: {
					minlength: 'Minimum 10 digit',
					maxlength: 'Maximum 10 digit'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success6.hide();
				error6.show();
				App.scrollTo(error6, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs

				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success6.show();
				error6.hide();
			}
		});
	};

	var handleAccountUpdateValidation = function () {

		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form6 = jQuery('#accountUpdateForm');
		var error6 = jQuery('.alert-danger', form6);
		var success6 = jQuery('.alert-success', form6);
		jQuery.validator.addMethod('companynamealphanumerics', function (value, element) {
			return this.optional(element) || /^[a-zA-Z0-9-_.,?@&#!'~*+;][a-zA-Z0-9-_.,?@&#!'~*+; ]+$/i.test(value);
		}, 'Invalid character for company name');

		jQuery.validator.addMethod('validurl', function (value, element) {
			return this.optional(element) || /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm.test(value);
		}, 'Please enter a valid web address');

		jQuery.validator.addMethod('not_allow_no', function (value, element) {
			return this.optional(element) || /^\d*[a-zA-Z]{1,}\d*/i.test(value);
		}, 'Please enter valid characters.');

		form6.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				accountname: {
					required: true,
					companynamealphanumerics: true
				},
				phone: {
					minlength: 14,
					maxlength: 14
				},
				location: {
					// companynamealphanumerics: true
					not_allow_no: true
				},
				about: {
					not_allow_no: true
				},
				accountFileUpload: {
					accept: 'image/*'
				},
				userFileUpload: {
					accept: 'image/*'
				},
				web: {
					validurl: true
				}
			},
			messages: {
				phone: {
					minlength: 'Minimum 10 digit',
					maxlength: 'Maximum 10 digit'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success6.hide();
				error6.show();
				App.scrollTo(error6, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs

				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success6.show();
				error6.hide();
			}
		});
	};

	var handleChangePassword = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#changePasswordForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				currentpassword: {
					required: true
				},
				newpassword: {
					required: true
				},
				confirmpassword: {
					required: true,
					equalTo: '#newpassword'
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};

	var handleValidation1 = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#signupForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('lettersonly', function (value, element) {
			return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
		}, 'Letters only please');
		jQuery.validator.addMethod('alphanumericsonly', function (value, element) {
			return this.optional(element) || /[^a-zA-Z0-9]/.test(value);

		}, 'Invalid character for company name');

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input

			rules: {
				firstname: {
					lettersonly: true,
					required: true
				},
				lastname: {
					lettersonly: true,
					required: true
				},
				company: {
					required: true,
					alphanumericsonly: true,
					remote: function () {
						var c = {
							type: 'POST',
							url: api.COMPANY_EXIST,
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify({ companyName: jQuery('#company').val() })
						};
						return c;

					},

				},
				password: {
					minlength: 5,
					required: true
				},
				confirmpassword: {
					required: true,
					equalTo: '#password'
				},

				email: {
					required: true,
					email: true,
					remote: function () {
						var r = {
							type: 'POST',
							url: api.EMAIL_EXIST,
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify({ email: jQuery('#email').val() })
						};
						return r;

					},
				},

				checkbox33: {
					required: true
				}
			},

			messages: {
				email: {
					remote: 'Email already taken'
				},
				company: {
					remote: 'Company already taken'
				},
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group

			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});


	};

	var handleValidation2 = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#form2');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input
			rules: {
				name: {
					minlength: 2,
					required: true
				},
				email: {
					required: true,
					email: true
				},
				email2: {
					required: true,
					email: true
				},
				url: {
					required: true,
					url: true
				},
				url2: {
					required: true,
					url: true
				},
				number: {
					required: true,
					number: true
				},
				number2: {
					required: true,
					number: true
				},
				digits: {
					required: true,
					digits: true
				},
				creditcard: {
					required: true,
					creditcard: true
				},
				delivery: {
					required: true
				},
				payment: {
					required: true,
					minlength: 2,
					maxlength: 4
				},
				memo: {
					required: true,
					minlength: 10,
					maxlength: 40
				},
				'checkboxes1[]': {
					required: true,
					minlength: 2,
				},
				'checkboxes2[]': {
					required: true,
					minlength: 3,
				},
				radio1: {
					required: true
				},
				radio2: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
				jQuery('#signup').prop('disabled', true);
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};

	var handleValidation3 = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#loginForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input
			rules: {
				email: {
					required: true,
					email: true
				},
				password: {
					required: true
				},

			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};

	var handleSetPasswordValidation = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#setPasswordForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);
		jQuery.validator.addMethod('passwordregex', function (value, element) {
			return this.optional(element) || /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/.test(value);

		}, 'Password must contain lowercases, uppercases & numbers.');


		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input
			rules: {
				password: {
					required: true,
					passwordregex: true,

				},
				confirmpassword: {
					required: true,
					equalTo: '#password'
				}
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};

	var updateEmailFormValidation = function () {
		// for more info visit the official plugin documentation:
		// http://docs.jquery.com/Plugins/Validation
		var form1 = jQuery('#updateEmailForm');
		var error1 = jQuery('.alert-danger', form1);
		var success1 = jQuery('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			ignore: '', // validate all fields including form hidden input
			rules: {
				new_email: {
					required: true,
					email: true,
					remote: function () {
						var r = {
							type: 'POST',
							url: api.EMAIL_EXIST,
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify({ email: jQuery('#new_email').val() })
						};
						return r;

					},
				},
				confirm_email: {
					email: true,
					required: true,
					equalTo: '#new_email'
				},
				old_password: {
					required: true
				},
			},
			messages: {
				new_email: {
					remote: 'Email already taken'
				},
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				success1.hide();
				error1.show();
				App.scrollTo(error1, -200);
			},

			errorPlacement: function (error, element) {
				if (element.is(':checkbox')) {
					error.insertAfter(element.closest('.md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline'));
				} else if (element.is(':radio')) {
					error.insertAfter(element.closest('.md-radio-list, .md-radio-inline, .radio-list,.radio-inline'));
				} else {
					error.insertAfter(element); // for other inputs, just perform default behavior
				}
			},

			highlight: function (element) { // hightlight error inputs
				jQuery(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				jQuery(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
			}
		});
	};
	return {
		//main function to initiate the module
		init: function () {
			handleLogin();
			handleCreateOpportunity();
			handleCreateOtherContact();
			handleCreateProposalContact();
			handleCreateContact();
			handleAddOtherStatusType();
			handleAddOtherProjectType();
			handleUpdateContact();
			handleCreateEstimate();
			handleUpdateEstimate();
			handleCreateProposal();
			handleCreateProject();
			handleCreateOrder();
			handleCreateOrderMore();
			handleCreateInvoice();
			handleCreateItem();
			handleCreateTimer();
			handleCreateWorklog();
			handleCreateDocument();
			handleCreateDaily();
			validatePhone();
			validateMail();
			validateAddress1();
			validateAddress2();
			validateCity();
			validateZip();
			handleCreateNote();
			handleCreateLetter();
			handleCreateFax();
			handleCreatePos();
			handleCreateTask();
			handleCreateEvent();
			handleCreateCall();
			handleCreateEmail();
			handleCreateExpense();
			handleCreateOtherItem();
			handleUpdateUser();
			handleAddressModal();
			handleChangePassword();
			handleProfileUpdateValidation();
			handleAccountUpdateValidation();
			handleNewAccountValidation();
			handleInviteUserValidation();
			handleInviteUserEditValidation();
			handleSetPasswordValidation();
			updateEmailFormValidation();
			handleValidation3();
			handleValidation1();
			handleValidation2();
			handleEstimateWithName();
		}
	};
}();

export const FloatLabel = function () {
	var handleMaterialFloat = function () {
		$('.form-md-floating-label .form-control')
			.each(function () {
				if ($(this).val()) {
					if ($(this).val().length > 0) {
						$(this).addClass('edited');
					}
				}
			});
	};
	return {

		// Main init methods to initialize the Material Float
		init: function () {
			handleMaterialFloat();
		}
	};
}();

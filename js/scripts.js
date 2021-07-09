////// PANELQ CUSTOM JS //////
$(function () {
	"use strict";
	$("body").append('<div id="loader" class="loader"><div class="spinner-grow"></div></div><div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog centered"><div class="modal-content-main"></div></div></div><div class="scrolltop"><i data-feather="chevrons-up"></i></div>'); // Add basic modal and loader to document
	feather.replace();
	$("#mobile-logo").replaceWith($(".navbar-brand").html()); // Add mobile menu from main menu
    if (typeof validate !== 'undefined') validate.init();
	if (typeof $().tooltip === 'function') $('body').tooltip({selector: '[title]'}); // Add tooltip listner
	$('.navbar-brand .pq-logo').on('click', function () {
		window.location = '/';
	});

	////////// NAVBAR //////////

	if (window.matchMedia("(max-width: 991px)").matches) {
		$("#navbarMenu .active").addClass("show");
	} else { $("#navbarMenu .active").removeClass("show"); }
	$(".navbar-menu .with-sub .nav-link").on("click", function (e) {
		e.preventDefault();
		$(this).parent().toggleClass("show");
		$(this).parent().siblings().removeClass("show");
	});
	$("#mainMenuClose").on("click", function (e) {
		e.preventDefault(); e.stopPropagation();
		$("body").removeClass("navbar-nav-show");
	});
	$("#mainMenuOpen").on("click", function (e) {
		e.preventDefault(); e.stopPropagation();
		$("body").addClass("navbar-nav-show");
	});
	
	$(document).on("click", function (e) {
		if (!e.target.closest(".navbar-menu-wrapper")) {
			$("body").removeClass("navbar-nav-show");
		}
	});
	
	$(document).on("click", function (e) {
		e.stopPropagation();
		if (window.matchMedia("(min-width: 992px)").matches) {
			if (!$(e.target).closest(".navbar-menu .nav-item").length) {
				$("#navbarMenu .show").removeClass("show");
			}
		}
	});

	var currentPath = location.pathname;
	$(".nav-item a").each(function () {
		var $this = $(this);
		if (currentPath == '/' || currentPath == '/admin') { return false; }
		if ($this.attr("href").indexOf(currentPath) != -1) {
			if ($this.hasClass('nav-link')) {
				$this.parent().addClass("active"); return false;
			} else { $this.addClass("active").parent().parent().parent().addClass("active");}
		}
    });
});

///// APP RELATED JS /////

window.addEventListener('load', function() {
	if ($('a.bell').length > 0) {
		$.ajax({
			url: '/notifications/data',
			success: function (resposne) {
				if (resposne.message) {
					$('a.bell').addClass('active').attr('title', 'You have a new message.');
				}
			}
		});
	}
});

// Global notifictaion/toast feature
function toast(status, message) {
    if ($('.toast').length > 0) $('.toast').remove();
    var id = Math.floor(Math.random() * 11);
    $('body').append(`<div id="toast${id}" class="toast"><div class="alert alert-${status} mb-0" role="alert">${message}</div></div>`);
    $toast = $(`#toast${id}`);
    $toast.addClass('animated bounceIn');
    setTimeout(function () {
        $toast.fadeOut();
        setTimeout(function () {
            $toast.remove();
        }, 300);
    }, 3000);
}

// Show loader on actions
$('.load').on('click', function () {
    $('#loader').addClass('show');
});
$('body').on('shown.bs.modal', function() {
    validate.destroy();
    validate.init();
});
// Load modal from ajax data
$(document).on("click", ".ajaxModal", function (e) {
    e.preventDefault(); e.stopPropagation();
    ajaxModal($(this).attr('href'));
});
function ajaxModal(url) {
    $('#loader').addClass('show');
    $.ajax({
        async: true,
        url: url,
        method: "GET",
        success: function (resposne) {
            if (resposne.success) {
                $('.modal-dialog').removeClass('modal-sm');
                $('#modal .modal-content-main').html(resposne.data);
                if (resposne.smallModal ?? false)
                    $('.modal-dialog').addClass('modal-sm');
                if (resposne.hasOwnProperty('modalSize'))
                    $('.modal-dialog').addClass(resposne.modalSize);
				$('#modal').modal('show');
				feather.replace();
                $('#loader').removeClass('show');
            } else {
                $('#loader').removeClass('show');
                toast('danger', resposne.message ?? 'Something went wrong..');
            }
        },
        error: function (jqXHR, exception) {
            $('#loader').removeClass('show');
            toast('danger', 'Something went wrong.');
        }
    });
}
// Delete confirmation modal
$(document).on("click", ".ajaxDelete", function () {
    $('#deleteForm').attr('action', $(this).data('url'));
    $('#data_name').text($(this).data('name'));
    $('.modal-content-main').html($('.deleteModal').html());
    $('#modal').modal('show');
});
// Replace target with ajax data
$(document).on("click", ".ajaxElement", function (event) {
    event.preventDefault();
    $target = $(this).data('target');
    if ($(this).is('[data-force]') || $($target).is(':empty')) {
        $('#loader').addClass('show');
        $.ajax({
            url: $(this).data('url'),
            success: function (resposne) {
                if (resposne.success)
                    $($target).html(resposne.data);
                else toast('danger', 'Something went wrong..');
                $('#loader').removeClass('show');
            },
            error: function (jqXHR, exception) {
                $('#loader').removeClass('show');
                toast('danger', 'Something went wrong.');
            }
        });
    }
});
// Simple URL validation function
function isUrl(string) {
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(regexQuery,"i");
    return url.test(string);
}
// Copy elemet text on click
$('.copy').each(function () {
    $(this).tooltip({
        title: "Copy",
        placement: "right"
    });
});
$(document).on('click', '.copy', function () {
    let $input = $("<input>");
    $("body").append($input);
    $input.val($(this).text()).select();
    document.execCommand("copy");
    $input.remove();
    $('.tooltip .tooltip-inner').text('Copied !')
    setTimeout(function () {
        $(this).attr('title', 'Copy');
    }, 500);
});

// Ajax form listner
$(document).on('click', '#ajaxForm', function (event) {
    event.preventDefault();
    $($(this).data('form')).trigger('submit');
});
$(document).on('submit', 'form.ajaxForm', function (event) {
    event.preventDefault();
    let $form = $(this);
    if ($form.find('.error-message:visible').length > 0) return;
    ajaxForm($form);
});

$('form:not(.no-load, .ajaxForm)').on('submit', () => $('#loader').addClass('show'));

function ajaxForm($form) {
	$('#loader').addClass('show');
    $.ajax({
        async: true, type: "post",
        url: $form.attr('action'),
        data: $form.serialize(),
        success: function (response) {
            if (response.success) {
                if (response.hasOwnProperty('target'))
					$(response.target).html(response.data);
				else if (typeof response.url !== 'undefined')
					location.replace(response.url);
				else location.reload();
            } else toast('danger', response.message ?? 'Something went wrong.');
			$('#loader').removeClass('show');
        },
        error: function (jqXHR, exception) {
            $('#loader').removeClass('show');
            toast('danger', 'Something went wrong.');
        }
    });
}

// Global document keypress listner
$(document).keypress(function (e) {
    // Prevent form submit on enter
    if (e.which == 13 && e.target.nodeName == "INPUT")
        e.preventDefault();
});

function quillConfig(configs = false) {
    var quillToolbar = ['bold', 'italic', 'underline', 'strike', { 'list': 'ordered' }, { 'list': 'bullet' }, { 'header': [2, 3, 4, 5, false] }];
    if (configs) $.merge(quillToolbar, configs);
    return {
        modules: { toolbar: quillToolbar },
        placeholder: 'Description...',
        theme: 'snow'
    };
}

let uploadingImage = false
$('body').on('DOMSubtreeModified', '.editor', function () {
	$editor = $($(this).data('target'));
    if (typeof (quill) !== 'undefined')
        $editor.val(quill.root.innerHTML);
    else return;
    if (uploadingImage) return;
    $('.editor img').each(function () {
        image = $(this);
        var imageSrc = image.attr('src');
        if (imageSrc && imageSrc[0] === 'd') {
            uploadingImage = true;
            $('#loader').addClass('show')
            $.ajax({
                async: true,
                url: 'https://api.imgur.com/3/image',
                type: 'post', data: { image: image.attr('src').split(',')[1] },
                headers: { Authorization: atob('Q2xpZW50LUlEIA==') + atob(HANDLE) },
                dataType: 'json',
                success: response => {
                    // image.attr('src', response.data.link.replace(/^http(s?):/, ''));
                    image.attr('src', response.data.link);
                    $editor.val(quill.root.innerHTML);
                    $('#loader').removeClass('show')
                },
                error: (xhr, type, err) => {
                    toast('danger', "Couldn't upload your image")
                    $('#loader').removeClass('show')
                }
            }).then(() => uploadingImage = false)
            // uploadingImage = false;
        }
    })
});

$(document).on('click', '#expandAll', e => {
    $this = $(e.target);
    if ($this.hasClass('expand')) {
        $this.removeClass('expand');
        $this.text('Expand All');
        $('.chevron').not('.collapsed').click();
    } else {
        $this.addClass('expand');
        $this.text('Collapse All');
        $('.chevron.collapsed').click();
    }
});

$(window).on('scroll', function () {
    if ($(this).scrollTop() > 50)
        $('.scrolltop:hidden').stop(true, true).fadeIn();
    else $('.scrolltop').stop(true, true).fadeOut();
});
$(document).on('click', '.scrolltop', () => {
    $("html, body").animate({ scrollTop: 0 }, 500);
});

$('thead.sorting th').on('click', function () {
    $sort = $(this).find('[data-sort]').data('sort');
    if (typeof $sort != "undefined") {
        $('.loader').addClass('show');
        window.location = `?sort=${$sort}`;
    } return;
});

$('th[data-sort]').on('click', function (e) {
	e.preventDefault(); e.stopPropagation();
    $sort = $(this).data('sort');
    if (typeof $sort != "undefined") {
        $('.loader').addClass('show');
        window.location = `?sort=${$sort}`;
    } return;
});

if ($('tbody input[type="checkbox"]').length > 0) {
    $('tbody tr input[type="checkbox"]').on('change', function () {
        if ($(this).prop('checked'))
            $(this).parent().parent().addClass('checked');
        else $(this).parent().parent().removeClass('checked');
    });

    $('tbody tr').on('click', function (e) {
        var $tags = ['INPUT', 'A'];
        if ($tags.includes(e.target.tagName) || e.target.className == 'copy') return;
        $(this).find('td input[type="checkbox"]').click();
    });
}

$(document).on('click', '.editor', function () {
	$(this).find('.ql-editor').focus();
});

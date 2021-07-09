$("#category").on("change", () => {
	let id = $("#category option:selected").val();
	if (id == "") { return; }
	resetFields();
	$("#service").empty().select2({
		minimumResultsForSearch: Infinity,
		data: services[id] ?? [{"id" : "", "text" : msg.noResult}],
		formatSelection: option => option.price,
		placeholder: 'Select Service'
	});
	service = $('#service option');
	$("#service").val((service[1] ?? service[0]).value).trigger('change');
});

$("#service").on("change", () => resetFields($('#service').select2('data')[0]));

$(".verify").on('click', () => {
	let link = $('[name="link"]').val();
	if (link == "" || !isUrl(link)) { toast("danger", msg.invalidField); return; }
	$(".loader").addClass("show");
	if (link.indexOf("instagram") > 0) {
		$.ajax({
			url: link,
			success: function (data) {
				var matches = data.match(/<title>(.*?)<\/title>/s);
				$("#title").text(matches[1]);
				var matches = data.match(/og:image" content="(.*?)"/s);
				$("#image").attr("src", matches[1] ?? "/app/img/placeholder.png");
				$("#verifyModal").modal("show");
				$(".loader").removeClass("show");
			},
			error: function (jqXHR, exception) {
				$(".loader").removeClass("show");
				toast("danger", msg.failedVerify);
				$(".verify").attr("disabled", true);
				$("#invalid_link").show();
				$('[name="link"]').attr("readonly", true);
			}
		});
	} else {
		$.ajax({
			url: verifyLink + '?url=' + encodeURIComponent(link),
			success: function (response) {
				if (response.success) {
					$("#title").text(response.title);
					$("#image").attr("src", response.image);
					$("#verifyModal").modal("show");
					$(".loader").removeClass("show");
				} else {
					$(".loader").removeClass("show");
					toast("danger", response.message);
					$(".verify").attr("disabled", true);
					$("#invalid_link").show();
					$('[name="link"]').attr("readonly", true);
				}
			}
		});
	}
});
$("#confirm_verify").on('click', () => {
	$("#verifyModal").modal("hide");
	$(".verify").attr("disabled", true);
	$('[name="link"]').attr("readonly", true);
});
$("#min_max").on("keyup change", () => {
	var price = $("#service").select2("data")[0].price;
	price = price * $("#min_max").val();
	$("#order_total").text(price.toFixed(4) + 0);
});
$("#comments").on('keyup', function () {
	var rawComments = $(this).val();
	var commentsArray = rawComments.split("\n");
	var commentsArray = commentsArray.filter(commentsArray => commentsArray);
	$(this).val(rawComments);
	$("#min_max").val(commentsArray.length).trigger("change");
});
function resetFields($this) {
	$(".verify").attr("disabled", false);
	$('[name="link"]').attr("readonly", false);
	$("#invalid_link").hide();
	var fill = $this == null ? false : true;
	$("#desc").html(fill ? $this.desc : "");
	$("#avg_time").text(fill ? $this.time : "");
	$("#min").text(fill ? $this.min : "");
	$("#max").text(fill ? $this.max : "");
	$("#min_max").attr("min", fill ? $this.min : "");
	$("#min_max").val(fill ? $this.min : 0).trigger('change');
	$("#min_max").attr("max", fill ? $this.max : "");	
	$('[name="verified"]').val(1);
	$("#order_total").text("0.00");
	if (fill && $this.type == "custom_comments") {
		$("#comments").show().attr("required", true);
		$("#min_max").attr("readonly", true);
	} else if (fill && $this.type == "poll") {
		$("#answer").show().attr("required", true);
		$("#min_max").attr("readonly", false);
	} else {
		$(".customs").hide().attr("required", false);
		$("#min_max").attr("readonly", false);
	}
}

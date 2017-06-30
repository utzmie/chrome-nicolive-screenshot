;!function($) {

	// Video container
	// ※HTMLの構造が放送によって異なるっぽい
	var $container;

	if ( $('#program-main-block')[0] ) {
		$container = $('#program-main-block'); // 一般の生放送
	} else {
		$container = $('#player-container'); // オフィシャル系？
	}


	// 放送中
	if ( $container[0] ) {

		// Include HTML
		$.get(chrome.extension.getURL('./button.html'), function(data) {
			$($.parseHTML(data)).appendTo($container);
		});

		// Onload
		$(window).on('load', function() {

			var buttonContainer = document.getElementById('uz9-capture-button-container');
			var captureButton   = document.getElementById('uz9-capture-button');
			var downloadButton  = document.getElementById('uz9-download-button');

			var canvasContainer = document.getElementById('uz9-canvas-container');
			var canvas          = document.getElementById('uz9-canvas');
			var cxt             = canvas.getContext('2d');

			var target = $container.find('video[src^="blob:http://live2.nicovideo.jp/"]')[0];

			// Remove Loading...
			$('#uz9-capture-contents').removeClass('disabled');
			$('#uz9-js-loading-container').remove();

			// Ratio
			var $ratio;
			var $ratioElmContainer = $('#uz9-capture-ratio-container');
			var $ratioElm          = $('#uz9-capture-ratio-container').find('input:checked');

			// Default
			if ( $ratioElm.val() ) {
				$ratio = $ratioElm.val();
			} else {
				$ratio = 2.0;
			}

			// Change ratio
			$ratioElmContainer.children('label').on('click', function() {
				$ratio = $(this).children('input').val();

				if ( $ratio == 1.0 ) {
					$('#uz9-canvas-container-outer').addClass('x1');
				} else {
					$('#uz9-canvas-container-outer').removeClass('x1');
				}
			});

			// Draw canvas
			captureButton.addEventListener('click', function() {
				canvas.width = target.clientWidth * $ratio;
				canvas.height = target.clientHeight * $ratio;
				cxt.drawImage(target, 0, 0, canvas.width, canvas.height);
			}, false);

			// Download image
			downloadButton.addEventListener('click', function() {
				var dt = canvas.toDataURL('image/jpg');
				this.href = dt;
			});
		});
	}

}(jQuery);
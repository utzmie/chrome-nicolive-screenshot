;!function($) {


	// 新配信 & HTML5プレイヤー
	if ( $('#flvplayer_container').length === 0 && $('#playerswf').length === 0 ) {
		// console.log( "新配信" );

		var $contentContainer = $("div[class^=___player-body-area]");

		$.get(chrome.extension.getURL('./button.html'), function(data) {
			$($.parseHTML(data)).appendTo( $contentContainer );
		});


		$(window).on('load', function() {

			var buttonContainer = document.getElementById('uz9-capture-button-container');
			var captureButton   = document.getElementById('uz9-capture-button');
			var downloadButton  = document.getElementById('uz9-download-button');

			var canvasContainer = document.getElementById('uz9-canvas-container');
			var canvas          = document.getElementById('uz9-canvas');
			var cxt             = canvas.getContext('2d');

			var target = $contentContainer.find('video[src^="blob:http://live2.nicovideo.jp/"]')[0];

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
				var dt = canvas.toDataURL('image/png');
				this.href = dt;
			});
		});

	// 旧配信 or Flashプレイヤー
	} else {
		// console.log( "旧配信 or FLASHプレイヤー" );
		var $extensionContents = $('<div class="uz9-capture-area-container uz9-is-flash-player uz9-is-new-broadcast">');
		var $flashNotification = $('<p class="uz9-flash-notification">Flashプレイヤーでの視聴のため、スクショ機能が利用できません。</p>');
			$flashNotification.appendTo($extensionContents);

		// 旧配信
		if ( $('#flvplayer_container')[0] ) {
			$('#slider_container').after( $extensionContents );
		}
		// 新配信だがFlashプレイヤー
		else if ( $('#playerswf')[0] ) {
			$('#playerswf').after( $extensionContents );
		}

	}


}(jQuery);
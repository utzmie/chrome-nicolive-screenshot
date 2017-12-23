;!function($) {

	// Video container
	// ※HTMLの構造が放送によって異なるっぽい
	var $container;

	if ( $('#program-main-block')[0] ) {
		$container = $('#program-main-block'); // 一般の生放送
	} else {
		$container = $('#player-container'); // オフィシャル系？
	}

	// 新配信
	if ( $container[0] ) {

		// HTML5版で視聴中（使用可能な状態）
		if ( $('#message-for-html5player-block')[0] || $('.message-for-html5player')[0] ) {

			// Include HTML
			$.get(chrome.extension.getURL('./button.html'), function(data) {
				$($.parseHTML(data)).appendTo($container);
			});

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
					var dt = canvas.toDataURL('image/png');
					this.href = dt;
				});
			});
		}

		// 新配信だけどユーザーがFlash版で再生
		else if ( $('#playerswf')[0] ) {
			var $extensionContents = $('<div class="uz9-capture-area-container uz9-is-flash-player uz9-is-new-broadcast">');
			$('#player-block').after($extensionContents); // 一般の生放送
			$('#player-container').after($extensionContents); // オフィシャル系？

			var $flashNotification = $('<p class="uz9-flash-notification">Flashプレイヤーでの視聴のため、スクショ機能が利用できません。</p>');
				$flashNotification.appendTo($extensionContents);
		}
	}

	// 通常配信
	else if ( $('#flvplayer_container')[0] ) {

		var $extensionContents = $('<div class="uz9-capture-area-container uz9-is-flash-player">');

		if ( $('#slider_container')[0] ) {
			$('#slider_container').after($extensionContents); // 一般の生放送
		} else {
			$('#watch_player_box').after($extensionContents); // オフィシャル系？
		}

		var $flashNotification = $('<p class="uz9-flash-notification">通常配信による放送のため、スクショ機能が利用できません。<br />放送主が「新配信」で放送を行なっているときに利用できます。</p>');
			$flashNotification.appendTo($extensionContents);
	}


}(jQuery);
export const ticketMasterHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;">
    <iframe
  id="WTMWidget"
  src="https://www.wtm360.co.uk/liam-smith-1669806344-eubank-jr-vs-smith.html?apikey=MVdUTTIyMDU4V1RNd3RtdGVzdDIzN0B3dG0zNjAuY29t&d=&ref=MjIwNTh8fDIyMDU4fHwzNzY5&nr=1"
  style="width: 100%; height: 100%"
  scrolling="no"
  frameborder="0"></iframe>

                                          
<script type="text/javascript">
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  window.addEventListener('message', function (event) {
    var iFrame = '';

    var actualHeight = '';

    if (event.origin === 'https://www.wtm360.co.uk') {
      if (event.data) {
        iFrame = window.parent.document.getElementById('WTMWidget');

        actualHeight = +event.data + 'px';

        if (actualHeight !== 'NaNpx') {
          if (iFrame.style.height !== actualHeight) {
            if (isIOS) {
              actualHeight = +(event.data + 90) + 'px';
            } else {
              actualHeight = +(event.data + 50) + 'px';
            }

            iFrame.style.height = actualHeight;

            var element = document.getElementById('WTMWidget');

            element.scrollIntoView();
          }
        }
      }
    }

    if (event.origin === 'https://www.wtm360.co.uk') {
      if (event.data) {
        iFrame = window.parent.document.getElementById('WTMWidget');

        actualHeight = +event.data.split(':')[1] + 'px';

        if (iFrame.style.height !== actualHeight) {
          if (isIOS) {
            actualHeight = Number(event.data.split(':')[1]) + 90 + 'px';
          } else {
            actualHeight = Number(event.data.split(':')[1]) + 50 + 'px';
          }

          iFrame.style.height = actualHeight;
        }
      }
    }
  });
</script>
  </body>
</html>
`;
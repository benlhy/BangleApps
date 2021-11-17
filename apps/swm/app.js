require("FontTeletext10x18Ascii").add(Graphics);

var gatt;

// Connect to a device that is advertising the services we are interested in
NRF.requestDevice({ timeout: 3000, filters: [{ services: ["ffe0", "fee7"] }] })
  .then(function (device) {
    console.log("found device");
    return device.gatt.connect();
  })
  .then(function (g) {
    gatt = g;
    //console.log("connected");
    return g.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb");
  })
  .then(function (s) {
    console.log("service found");
    return s.getCharacteristic("0000ffe1-0000-1000-8000-00805f9b34fb");
  })
  .then(function (c) {
    c.on("characteristicvaluechanged", function (event) {
      var result = String.fromCharCode.apply(null, event.target.value.buffer);
      console.log("->" + result);
      // create the display
      draw(result.trim().split(","));
    });
    return c.startNotifications();
  });

function draw(resultArray) {
  var x = g.getWidth() / 2 - 50;
  var y = g.getHeight() / 2 + 30;
  g.reset();
  g.setFontAlign(-1, 0).setFont("Teletext10x18Ascii");
  g.clearRect(0, 30, g.getWidth(), g.getHeight());
  var c1 = resultArray[0];

  var c2 = resultArray[1];
  var v1 = resultArray[2];
  var v2 = resultArray[3];

  g.drawString("c1:" + c1 + "uA", x, y + 30);
  g.drawString("c2:" + c2 + "uA", x, y + 10);
  g.drawString("v1:" + v1 + "mV", x, y - 10);
  g.drawString("v2:" + v2 + "mV", x, y - 30);
}

g.clear();

Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();

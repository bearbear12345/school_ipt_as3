function beginload() {
    if (parameters.indexOf("?") + 1 != 0) { //If there are parameters
      hasargs = true;
      parameters = parameters.substring(parameters.indexOf("?") + 1).split("&");
      var img = new Image();
      img.onerror = function () {
        console.log('Page not found! Redirecting...');
        loadfourohfour();
      }
      img.src = 'products/' + parameters[0] + '/product.jpg';
    } else {
      hasargs = false;
    }
  }

/*
function loadproduct(productcode) {
   // Webserver only
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      productready = true;
      productinfo = xmlhttp.responseText.split('\n');
      // productinfo[0] -> Name
      // productinfo[1] -> Price
      // productinfo[2] -> Availability
      // productinfo[3] -> Description
    }
  }
  xmlhttp.open("GET", "../assets/products/" + productcode + "/info.txt", true);
  //xmlhttp.open("GET", "products/" + productcode + "/info.txt", true);
  xmlhttp.send();
}
*/

function loadpath(url, callback) {
  result = document.createElement("iframe");
  result.src = url;
  result.style.height = 0;
  result.style.height = 0;
  result.style.display = "none";
  result.onload = function () {
    callback();
  };
  document.head.appendChild(result);
}

function loadproduct(productcode) {
  loadpath("products/" + productcode + "/info.txt", loadproduct_cont);
}

function loadproduct_cont() {
  productready = true;
  try {
    productinfo = result.contentWindow.document.body.innerHTML.replace(/(<([^>]+)>)/ig, "").split("\n");
  } catch (e) {
	/* Redundant as the index wrapper blocks chrome (Local file issue only)
    // Cross domain error, most likely
    //
    // Just chrome???
    // - "SecurityError: Blocked a frame with origin "null" from accessing a cross-origin frame."
	*/
    productready = false;
  }
  // productinfo[0] -> Name
  // productinfo[1] -> Price
  // productinfo[2] -> Availability
  // productinfo[3] -> Description
  document.head.removeChild(result);
}

function loadfourohfour() {
  loadpath("404.html", loadfourohfour_cont);
}

function loadfourohfour_cont() {
    document.body.innerHTML = result.contentWindow.document.body.innerHTML;
    document.head.removeChild(result);
  }
  
  /*
function loadfourohfour() {
  // Webserver only
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      return document.getElementsByTagName('html')[0].innerHTML = xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET", "404.html", false);
  xmlhttp.send();
}
*/

function replace() {
  if (productready) {
    productcategory = productinfo[0].substring(productinfo[0].indexOf(';') + 1).toLowerCase().trim(); //Seems to be a zero-width character somewhere, although trimming fixes the issue.
    productname = productinfo[0].substring(0, productinfo[0].indexOf(';'));
    if (productcategory == 'scuba/snorkeling gear') {
      document.getElementById('product_location').innerHTML = "<a href='home.html'><img style='margin-right: 2px; padding-bottom: 4px; vertical-align: middle;' src='../assets/images/home.png' alt='Home logo'/>Home</a> > <a href='products.html'>Products</a> > <a href='scubasnorkelinggear'>" + productinfo[0].substring(productinfo[0].indexOf(';') + 1) + "</a> > <b>" + productname + "</b>";
    } else {
      document.getElementById('product_location').innerHTML = "<a href='home.html'><img style='margin-right: 2px; padding-bottom: 4px; vertical-align: middle;' src='../assets/images/home.png' alt='Home logo'/>Home</a> > <a href='products.html'>Products</a> > <a href='" + productcategory + "'>" + productinfo[0].substring(productinfo[0].indexOf(';') + 1) + "</a> > <b>" + productname + "</b>";
    }
    document.getElementById('productname').innerHTML = productname;
    document.getElementById('productcode').innerHTML = "Product Code: " + parameters[0];
    if (productinfo[1].indexOf(";") > -1) {
      //Discount
      priceinfo = productinfo[1].split(';');
      document.getElementById('productdatabaseinfo_price').innerHTML = "Price: <strike>$" + priceinfo[0] + "</strike> $" + priceinfo[2] + "<br>" + priceinfo[1] + "% discount";
    } else {
      //No discount
      document.getElementById('productdatabaseinfo_price').innerHTML = "Price: $" + productinfo[1];
    }
    if (productinfo[2] != 0) {
      document.getElementById('productdatabaseinfo_availability').innerHTML = "Availability: <span style='color: green';>Product In Stock</span>";
    } else {
      document.getElementById('productdatabaseinfo_availability').innerHTML = "Availability: <span style='color: red';>Product Out Of Stock</span>";
    }
    document.getElementById('productdescription').innerHTML = productinfo[3];
    //Set product category
    if (productcategory == 'scuba/snorkeling gear') {
      document.getElementById('product_category_scubasnorkeling_gear').className += ' active';
    } else {
      document.getElementById('product_category_' + productcategory).className += ' active';
    }
    document.getElementById('productimage').src = "products/" + parameters[0] + "/product.jpg";
    $("#productbarcode").barcode(parameters[0], "code128");
    document.getElementById('pcontent').style.display = "inherit";
  }
}

//Utility snippets from my previous projects - Andrew Wong
Array.prototype.add=function(item) {
  this[this.length]=item;
  return this;
}
Array.prototype.remove=function(item, selector) {
  array=[];
  if (typeof selector === 'undefined') {
    for (var a=0; a<this.length;a++) {
      if (a==this.indexOf(item)) continue;
      array.add(this[a]);
    }
  } else {
	  var tmparray=[];
      for (var b=0; b<this.length;b++) {
        if (this[b]!=item) continue;
        tmparray.add(b);
      }
	  for (var c=0; c<this.length;c++) {
		if (c==tmparray[selector]) continue;
        array.add(this[c]);
      }
  }
  return array;
}
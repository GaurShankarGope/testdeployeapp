  //$.getElementById('a');
        
//   $.getElementById("text_disabled").readOnly = true;

//   var a = $.getElementById('a');
//   var b = $.getElementById('b');
//   var result = $.getElementById('result');
  
  function changed(a,b,result) {
        alert("a",a);
    var a = $.getElementById('a');
    var b = $.getElementById('b');
    var result = $.getElementById('result');
      if(window.diffType == 'applyPatch') {
          b.textContent = JsDiff.applyPatch(a.textContent, result.textContent);
      } else if(window.diffType == 'createPatch') {
          result.textContent = JsDiff.createPatch('filename',a.textContent, b.textContent,'left','right');
      } else {
          var diff = JsDiff[window.diffType](a.textContent, b.textContent);
          var fragment = $.createDocumentFragment();
          for (var i=0; i < diff.length; i++) {
  
              if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
                  var swap = diff[i];
                  diff[i] = diff[i + 1];
                  diff[i + 1] = swap;
              }
  
              var node;
              if (diff[i].removed) {
                  node = $.createElement('del');
                  node.appendChild($.createTextNode(diff[i].value));
              } else if (diff[i].added) {
                  node = $.createElement('ins');
                  node.appendChild($.createTextNode(diff[i].value));
              } else {
                  node = $.createTextNode(diff[i].value);
              }
              fragment.appendChild(node);
          }
  
          result.textContent = '';
          result.appendChild(fragment);
      }
  }
  
//   window.onload = function() {
//       onDiffTypeChange($.querySelector('#settings [name="diff_type"]:checked'));
//       changed();
//       getdata();
 
//       a.onpaste = a.onchange =
//       b.onpaste = b.onchange =
//       result.onpaste = result.onchange =
//        changed;
      
//     };
  
  
  if ('oninput' in a) {
      a.oninput = b.oninput = result.oninput = changed;
  } else {
      a.onkeyup = b.onkeyup = result.onkeyup = changed;
  }
  
  function onDiffTypeChange(radio) {
      window.diffType = radio.value;
      $.title = "Diff " + radio.parentNode.innerText;
      if(window.diffType == "applyPatch") {
          b.removeAttribute('contenteditable');
          result.setAttribute('contenteditable','true');
      } else {
          result.removeAttribute('contenteditable');
          b.setAttribute('contenteditable','true');
      }
  }
  
  var radio ='diffWords';
  for (var i = 0; i < radio.length; i++) {
      radio[i].onchange = function(e) {
          onDiffTypeChange(e.target);
          changed();
      }
  }
  
  function savedata()
  {
      var result = $.getElementById('result');
      var data = result.innerHTML;
      var data1 = result.innerText;
      
      /*var encoded = encodeURIComponent(data);
      var encoded1 = encodeURIComponent(data1);*/
      $.ajax({
                      type: "POST",
                      url: "emp_add.php",
                      data:{'data': data,'data1':data1},
                      dataType: "json",
                      success: function(data) {
                          console.log(data);
                         return true;
                      }
                  });
  }
  
  function getdata()
  {
  
      $.ajax({
                      type: "GET",
                      url: "get_emp_data.php",
                      dataType: "json",
                      success: function(data) {
                          $('#set_text').html(data.para);
                          $('#a').html(data.para_one);
                          $('#b').html(data.para);
                         return true;
                      }
                  });
  }
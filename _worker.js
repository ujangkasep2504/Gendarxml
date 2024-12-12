var worker_default = {
  async fetch(request, env, ctx) {
    try {
      const response = await fetch('https://bmkg.xyz/ip.json');
      const listProxy = await response.text().split('\n').map(entry => {
        const [proxyIP, proxyPort] = entry.split(',');
        return { proxyIP, proxyPort };
      });

      const upgradeHeader = request.headers.get("Upgrade");
      const url = new URL(request.url);

      if (upgradeHeader === "websocket") {
        // Handler websocket
      } else {
        const allConfig = await getAllConfigVless(env, request.headers.get("Host"), listProxy);
        return new Response(allConfig, {
          status: 200,
          headers: { "Content-Type": "text/html;charset=utf-8" }
        });
      }
    } catch (err) {
      return new Response(An error occurred: ${err.toString()}, { status: 500 });
    }
  }
};
async function getAllConfigVless(env, hostName, listProxy) {
  try {
    let v2rayConfigs = "";
    let v2raytable = "";
    let vlessConfigs = "";
    let trojanConfigs = "";
    for (const entry of listProxy) {
      const { proxyIP, proxyPort, country, isp } = entry;
      const vlessTls = `vless://${generateUUIDv4()}@${hostName}:443?encryption=none&security=tls&sni=${hostName}&fp=randomized&type=ws&host=${hostName}&path=/vl%3D${proxyIP}%3A${proxyPort}#${country} ${isp}`;
      const vlessNtls = `vless://${generateUUIDv4()}@${hostName}:80?path=/vl%3D${proxyIP}%3A${proxyPort}&security=none&encryption=none&host=${hostName}&fp=randomized&type=ws&sni=${hostName}#${country} ${isp}`;
      const vlessTlsFixed = vlessTls.replace(/ /g, "+");
      const trojanTls = `trojan://${generateUUIDv4()}@${hostName}:443?security=tls&type=ws&host=${hostName}&sni=${hostName}&fp=random&path=/tr%3D${proxyIP}%3A${proxyPort}#${country} ${isp}`;
      const trojanTlsFixed = trojanTls.replace(/ /g, '+');

   v2raytable += ` <tr> 
       
<td class="tablinks" onclick="openCity(event, 'v2ray${proxyIP}:${proxyPort}')"><p style="font-size: 24px; "><a href="#v2ray${proxyIP}:${proxyPort}">${isp} | (${country})</a></p><hr class="config-divider" /></td>
</tr>
      
        `;
   v2rayConfigs += `  <div id="v2ray${proxyIP}:${proxyPort}" class="tabcontent">
                                  <div class="config-section">  <pre><b>               
<hr class="config-divider" /> <p class="config">
Â» Domain      : ${hostName}
Â» ISP         : ${isp}
Â» Country     : (${country})
Â» UUID        : ${generateUUIDv4()}
Â» Port TLS    : 443
Â» Port NTLS   : 80
Â» Security    : auto
Â» Network     : (WS)
Â» Path Vless  : /vl=${proxyIP}:${proxyPort}
Â» Path Trojan : /tr=${proxyIP}:${proxyPort}</p>
<hr class="config-divider" /></b>

</pre>  </div><hr class="config-divider" /><div class="config-section"> 
       <p style="font-size: 28px; "><strong>ISP  :  ${isp} (${country}) </strong> </p>
    <hr />
    
        <div class="config-block">
                <h3>VLESS TLS:</h3>
                <p class="config">${vlessTlsFixed}</p>
                <button class="button2" onclick='copyToClipboard("${vlessTlsFixed}")'><i class="fa fa-clipboard"></i>Copy</button>
               </div>
              <hr /> 
              
            <div class="config-block">
                <h3>VLESS NTLS:</h3>
                <p class="config">${vlessNtlsFixed}</p>
                <button class="button2" onclick='copyToClipboard("${vlessNtlsFixed}")'><i class="fa fa-clipboard"></i>Copy</button>
            </div><hr /> 
            <div class="config-block">
                <h3>TROJAN TLS:</h3>
          <p class="config">${trojanTlsFixed}</p>
                <button class="button2" onclick='copyToClipboard("${trojanTlsFixed}")'><i class="fa fa-clipboard"></i>Copy</button>
               </div>
               
          
            <hr />
           <a href="#defaultOpen">BACK TO SEARCH</a> 

       
        
    </div>    </div>


`;

    trojanConfigs += `<div class="config-section">
    <p><strong>ISP  :  ${isp} (${country}) </strong> </p>
    <hr />
    <div class="config-toggle">
        <button class="button" onclick="toggleConfig(this, 'show Trojan', 'hide Trojan')">Show Trojan</button>
        <div class="config-content">
            <div class="config-block">
                <h3>TLS-Only:</h3>
                <p class="config">${trojanTlsFixed}</p>
                <button class="button" onclick='copyToClipboard("${trojanTlsFixed}")'><i class="fa fa-clipboard"></i>Copy</button>
            </div>
            <hr />
        </div>
    </div>
</div>
<hr class="config-divider" />
`;
    }
    const htmlConfigs = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>FREE | CF | VLESS | TROJAN | BMKG-XYZ</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">

    <!-- Favicon -->
    
<link href="https://bmkg.xyz/bot/bootstrap.min.css" rel="stylesheet">
   
  <link href="https://bmkg.xyz/css/config.css" rel="stylesheet">
   <link href="https://bmkg.xyz/bot/tables/table.css" rel="stylesheet">
    <!-- Custom styles for this template -->

  <!-- Fonts and icons -->
  
<style>
  body {
  
  background-color: #000;
}
  div.dt-container .dt-search input {
  border: 1px solid #fff;
  border-radius: 3px;
  padding: 5px;
  background-color: red;
  color: inherit;
  margin-left: 3px;
}
  div.dt-container .dt-length,
div.dt-container .dt-search,
div.dt-container .dt-info,
div.dt-container .dt-processing,
div.dt-container .dt-paging {
  color: inherit;
}
  html.dark .dt-container .dt-search input,
html.dark .dt-container .dt-length select {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: blue;
}
*[dir=rtl] div.dt-container div.dt-search input {
  margin: 0 3px 0 0;
}
  div.dt-container .dt-paging .dt-paging-button {
  box-sizing: border-box;
  display: inline-block;
  min-width: 1.5em;
  padding: 0.5em 1em;
  margin-left: 2px;
  text-align: center;
  text-decoration: none !important;
  cursor: pointer;
  color: inherit !important;
  border: 1px solid #fff;
  border-radius: 2px;
  background: #b60000;
}
}
div.dt-container .dt-paging .dt-paging-button:hover {
  color: white !important;
  border: 1px solid #fff;
  background-color: #b60000;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #585858), color-stop(100%, #111)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #b60000 0%, #00869e 100%); /* Chrome10+,Safari5.1+ */
  background: -moz-linear-gradient(top, #b60000 0%, #00869e 100%); /* FF3.6+ */
  background: -ms-linear-gradient(top, #b60000 0%, #00869e 100%); /* IE10+ */
  background: -o-linear-gradient(top, #b60000 0%, #00869e 100%); /* Opera 11.10+ */
  background: linear-gradient(to bottom, #b60000 0%, #00869e 100%); /* W3C */
}
div.dt-container .dt-paging .dt-paging-button:active {
  outline: none;
  background-color: #0090a9;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #2b2b2b), color-stop(100%, #0c0c0c)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #b60000 0%, #00869e 100%); /* Chrome10+,Safari5.1+ */
  background: -moz-linear-gradient(top, #b60000 0%, #00869e 100%); /* FF3.6+ */
  background: -ms-linear-gradient(top, #b60000 0%, #00869e 100%); /* IE10+ */
  background: -o-linear-gradient(top, #b60000 0%, #00869e 100%); /* Opera 11.10+ */
  background: linear-gradient(to bottom, #b60000 0%, #00869e 100%); /* W3C */
  box-shadow: inset 0 0 3px #0090a9;
}

  html.dark .dt-container .dt-paging .dt-paging-button.current, html.dark .dt-container .dt-paging .dt-paging-button.current:hover {
  border: 1px solid rgba(164, 0, 0, 0.9);
  background: rgba(164, 0, 0, 0.9);
}
html.dark .dt-container .dt-paging .dt-paging-button.disabled, html.dark .dt-container .dt-paging .dt-paging-button.disabled:hover, html.dark .dt-container .dt-paging .dt-paging-button.disabled:active {
  color: #0090a9 !important;
}
html.dark .dt-container .dt-paging .dt-paging-button:hover {
  border: 1px solid rgba(164, 0, 0, 0.9);
  background: rgba(164, 0, 0, 0.9);
}
html.dark .dt-container .dt-paging .dt-paging-button:active {
  background: #0090a9;
}
.container {
  max-width: 960px;
  background-color: #000;
}

.border-top { border-top: 1px solid #e5e5e5; }
.border-bottom { border-bottom: 1px solid #e5e5e5; }
.border-top-gray { border-top-color: #adb5bd; }

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

.lh-condensed { line-height: 1.25; }

  :root {
        --primary: #EB1616;
        --secondary: #000000;
        --light: #000000;
        --dark: #000000;       
        --accent-: #ff00ff;        
        --darker-: #040608;
        --card-bg: rgba(8, 12, 20, 0.71);
        --glow: 0 0 25px rgba(205, 0, 0, 1);
      }  
header {
  background-color: grey;
  position: fixed;
  left: 0;
  width: 0%;
  text-align: center;
}
.header {
  background-color: grey;
  position: fixed;
  left: 0;

  width: 0%;
  text-align: center;
}

  .button2 {
                background-color: #ffa500;
                border: none;
                color: #1e1e1e;
                padding: 6px 12px;
                text-align: center;
                text-decoration: none;
                font-size: 20px;
                border: 1px solid #3c3c3c;
                border-radius: 5px;
                animation: slideIn 0.5s ease-in-out;
                box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.5);
                transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .button2:hover {
                background-color: #ff8c00;
                transform: scale(1.05);
            }
  .card {
            position: relative;
            width: 100%;
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
            border-radius: 12px;
            padding: 15px;
            box-sizing: border-box;
            margin: 15px;
        }
        .card:hover {
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8);
            transform: translateY(-5px);
        }
        .card__top {
            height: auto;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 15px;
            position: relative;
        }
        .card__top img {
            width: 100%;
            height: auto;
            object-fit: cover;
            display: block;
        }
  .content1 {
            display: none;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }

        .content1.active {
            display: block;
            opacity: 1;
        }
.config-header {
        max-width: 100%;
        background: var(--card-bg); 
        color: #fff;
        backdrop-filter: blur(10px);
        border: 0px solid rgba(242, 89, 0, 1);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: ;
        transform-style: preserve-3d;
        animation: cardFloat 6s ease-in-out infinite;
        }
  .config-menu {
        max-width: 100%;
        background: var(--card-bg);
        color: #fff;
        backdrop-filter: blur(10px);
        border: 0px solid rgba(242, 89, 0, 1);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: var(--glow);
        transform-style: preserve-3d;
        animation: cardFloat 6s ease-in-out infinite;
        }
  .config-section {
        max-width: 100%;
        background: var(--card-bg);
        color: #fff;
        backdrop-filter: blur(10px);
        border: 0px solid rgba(242, 89, 0, 1);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: var(--glow);
        transform-style: preserve-3d;
        animation: cardFloat 6s ease-in-out infinite;
        }
  .config-footer {
        max-width: 100%;
        background: var(--card-bg);
        color: #fff;
        backdrop-filter: blur(10px);
        border: 0px solid rgba(242, 89, 0, 1);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: ;
        transform-style: preserve-3d;
        animation: cardFloat 6s ease-in-out infinite;
        }
          .config-sectionlogo {
            background: rgba(0, 0, 0, 0.5);
            background-color: #000000;
            padding: 20px;
            color: #448998;
            margin-right: 5px;
            margin-left: 5px;
            border: 2px solid #000000;
            border-radius: 10px;
            position: relative;
            animation: slideIn 0.5s ease-in-out;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        @keyframes slideIn {
            from { transform: translateX(-30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .config-section h3 {
            margin-top: 0;
            color: #e1b12c;
            font-size: 28px;
        }

        .config-section p {
            color: #f5f5f5;
            font-size: 16px;
        }

        .config-toggle {
            margin-bottom: 10px;
        }

        .config-content1 {
            display: none;
        }

        .config-content1.active {
            display: block;
        }

        .config-block {
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 10px;
            background-color: rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
        }

        .config-block h4 {
            margin-bottom: 8px;
            color: #f39c12;
            font-size: 22px;
            font-weight: 600;
        }

        .config {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 5px;
            border: 2px solid #448998;
            color: #f5f5f5;
            word-wrap: break-word;
            white-space: pre-wrap;
            font-family: 'Courier New', Courier, monospace;
            font-size: 15px;
        }
        
    

        .config-divider {
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, #fff, transparent);
            margin: 20px 0;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 32px;
            }

            .config-section h3 {
                font-size: 24px;
            }

            .config-block h4 {
                font-size: 20px;
            }
.tab {
  overflow: hidden;
 
}
.tab button {
 
}
.tab button:hover {
} 
.tab button.active {
 
}
.tabcontent {
  display: none;

}
.tabcontent1 {
  display: none;

}

main {
  padding-top: 80px; /* bad, because it's fixed */
}
.footer {
   position: fixed;
   left: 0;
   bottom: 0;   
   width: 100%;
   text-align: center;
}
</style>



  </head>

  <body>


            


<div class="container">
   
      
      <div class="py-5 text-center">
       <div class="config-header">
<div class="card__top">
          <img src="https://raw.githubusercontent.com/win877969/NS1/refs/heads/main/img/icon.png" alt="XVPN" height="150" width="75">
                        
        </div>
        
            <!-- Sale & Revenue Start -->
             </div>
</div>
      <div class="row">
        <div class="col-md-5 order-md-2 mb-4">
          <div class="config-menu">



                          
        <strong><b><p style="font-size: 28px;">DAFTAR WILCARD:<p></strong> 
      <hr class="config-divider" />  
<br>Â» ava.game.naver.com.${hostName}
<br>Â» graph.instagram.com.${hostName}
<br>Â» quiz.int.vidio.com.${hostName}
<br>Â» live.iflix.com.${hostName}
<br>Â» support.zoom.us.${hostName}
<br>Â» blog.webex.com.${hostName}
<br>Â» investors.spotify.com.${hostName}
<br>Â» cache.netflix.com.${hostName}
<br>Â» zaintest.vuclip.com.${hostName}
<br>Â» io.ruangguru.com.${hostName}</b></hr></div>
        <hr class="config-divider" />
      
          <div class="config-menu">
  <table id="example" width="100%">
  <center>
  
<div class="tablinks" onclick="openCity(event, 'v2rayaktif')" id="defaultOpen">
  <p style="font-size: 30px; color: red;">LIST V2RAY<hr class="config-divider" /></p></div></center>
  <thead>
            <tr>
                <th><hr/> <p style="font-size: 25px; ">ISP | COUNTRY</p><hr/> </th>
              </tr>
        </thead>
        <tbody>
            
            ${v2raytable}
             </tbody>
             
              </table>

           </div>
        </div>

        
          
        <div class="col-md-7 order-md-1"">
               ${v2rayConfigs}
                                  
           

      <div id="v2rayaktif" class="tabcontent">
  <div class="config-section">  <pre><b>
<hr class="config-divider" /><p class="config">
Â» Domain      : ${hostName}
Â» ISP         : CV. Rumahweb Indonesia
Â» Country     : Indonesia
Â» UUID        : ${generateUUIDv4()}
Â» Port TLS    : 443
Â» Port NTLS   : 80
Â» Security    : auto
Â» Network     : (WS)
Â» Path Vless  : /vl=203.194.112.119:8443
Â» Path Trojan : /vl=203.194.112.119:8443</p>
<hr class="config-divider" /></b>

</pre>  </div><hr class="config-divider" />
         <div class="config-section">

    <p style="font-size: 27px; "><strong>ISP  :  CV. Rumahweb Indonesia (ID) </strong> </p>
    <hr />
    
       
               <div class="config-block">
                <h3>VLESS TLS:</h3>
                <p class="config">vless://${generateUUIDv4()}@${hostName}:443?encryption=none&security=tls&sni=${hostName}&fp=randomized&type=ws&host=${hostName}&path=%2Fvl%3D203.194.112.119%3A8443#CV.+Rumahweb+Indonesia+(ID)</p>
                <button class="button2" onclick='copyToClipboard("vless://${generateUUIDv4()}@${hostName}:443?encryption=none&security=tls&sni=${hostName}&fp=randomized&type=ws&host=${hostName}&path=%2Fvl%3D203.194.112.119%3A8443#CV.+Rumahweb+Indonesia+(ID)")'><i class="fa fa-clipboard"></i>Copy</button><hr/>
               </div>
               
              
            <hr />
            <div class="config-block">
                <h3>VLESS NTLS:</h3>
                <p class="config">vless://${generateUUIDv4()}@${hostName}:80?path=%2Fvl%3D203.194.112.119%3A8443&security=none&encryption=none&host=${hostName}&fp=randomized&type=ws&sni=${hostName}#CV.+Rumahweb+Indonesia+(ID)</p>
                <button class="button2" onclick='copyToClipboard("vless://${generateUUIDv4()}@${hostName}:80?path=%2Fvl%3D203.194.112.119%3A8443&security=none&encryption=none&host=${hostName}&fp=randomized&type=ws&sni=${hostName}#CV.+Rumahweb+Indonesia+(ID)")'><i class="fa fa-clipboard"></i>Copy</button>
            </div>
            
            <hr />
            <div class="config-block">
                <h3>TROJAN TLS:</h3>
          <p class="config">trojan://${generateUUIDv4()}@${hostName}:443?security=tls&type=ws&host=${hostName}&sni=${hostName}&fp=random&path=%2Ftr%3D203.194.112.119%3A8443#CV.+Rumahweb+Indonesia+(Indonesia)</p>
                <button class="button2" onclick='copyToClipboard("trojan://${generateUUIDv4()}@${hostName}:443?security=tls&type=ws&host=${hostName}&sni=${hostName}&fp=random&path=%2Ftr%3D203.194.112.119%3A8443#CV.+Rumahweb+Indonesia+(Indonesia)")'><i class="fa fa-clipboard"></i>Copy</button>
               </div>
</hr>
                            
                        <a href="#defaultOpen">BACK TO SEARCH</a> 

                    
                      
                      
                   </div>
         </div>
        </div>
      </div>

      

            <!-- Sale & Revenue End -->


            <!-- Sales Chart Start -->


 


            <!-- Footer Start -->
              <footer class="my-5 pt-5 text-muted text-center text-small">

   <div class="footer">
    <div class="config-footer">  <p class="mb-1">
                            &copy; <a href="#">BMKG.XYZ</a>, All Right Reserved. 

                            
                            Designed By <a href="https://t.me/seaker877/">SEAKER</a>
                            <br>Distributed By: <a href="https://wa.me/6281335135082" target="_blank">Theme-X</a>
                        </p>
                          </div>  
    </div></footer>

    </div>

        <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script>window.jQuery || document.write('<script src="https://bmkg.xyz/bot/jquery-slim.min.js"><\/script></script>
    <script src="https://bmkg.xyz/bot/popper.min.js"></script>
    <script src="https://bmkg.xyz/bot/bootstrap.min.js"></script>
    <script src="https://bmkg.xyz/vendor/holder.min.js"></script>
      
      
          <script src="https://bmkg.xyz/bot/tables/table1.js"></script>
    <script src="https://bmkg.xyz/bot/tables/query.js"></script>
      
        <script>
       new DataTable('#example');
</script>   

<script>
     function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
</script>

   
     <script>
        function showContent1(contentId) {
            const contents = document.querySelectorAll('.content1');
            contents.forEach(content1 => {
                content1.classList.remove('active');
            });
            document.getElementById(contentId).classList.add('active');
        }
        function salinTeks() {
            var teks = document.getElementById('teksAsli');
            teks.select();
            document.execCommand('copy');
            alert('Teks telah disalin.');
        }
        function copyClash(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text)
            .then(() => {
            const alertBox = document.createElement('div');
            alertBox.textContent = "Copied to clipboard!";
            alertBox.style.position = 'fixed';
            alertBox.style.bottom = '20px';
            alertBox.style.right = '20px';
            alertBox.style.backgroundColor = 'yellow';
            alertBox.style.color = '#000';
            alertBox.style.padding = '10px 20px';
            alertBox.style.borderRadius = '5px';
            alertBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            alertBox.style.opacity = '0';
            alertBox.style.transition = 'opacity 0.5s ease-in-out';
            document.body.appendChild(alertBox);
            setTimeout(() => {
                alertBox.style.opacity = '1';
            }, 100);
            setTimeout(() => {
                alertBox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(alertBox);
                }, 500);
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy to clipboard:", err);
        });
        }
function fetchAndDisplayAlert(path) {
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(\`HTTP error! Status: \${response.status}\`);
            }
            return response.json();
        })
        .then(data => {
            const proxyStatus = data.proxyStatus || "Unknown status";
            const alertBox = document.createElement('div');
            alertBox.textContent = \`Proxy Status: \${proxyStatus}\`;
            alertBox.style.position = 'fixed';
            alertBox.style.bottom = '20px';
            alertBox.style.right = '20px';
            alertBox.style.backgroundColor = 'yellow';
            alertBox.style.color = '#000';
            alertBox.style.padding = '10px 20px';
            alertBox.style.borderRadius = '5px';
            alertBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            alertBox.style.opacity = '0';
            alertBox.style.transition = 'opacity 0.5s ease-in-out';
            document.body.appendChild(alertBox);
            
            setTimeout(() => {
                alertBox.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                alertBox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(alertBox);
                }, 500);
            }, 2000);
        })
        .catch((err) => {
            alert("Failed to fetch data or invalid response.");
        });
}
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    const alertBox = document.createElement('div');
                    alertBox.textContent = "Copied to clipboard!";
                    alertBox.style.position = 'fixed';
                    alertBox.style.bottom = '20px';
                    alertBox.style.right = '20px';
                    alertBox.style.backgroundColor = 'yellow';
                    alertBox.style.color = '#000';
                    alertBox.style.padding = '10px 20px';
                    alertBox.style.borderRadius = '5px';
                    alertBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    alertBox.style.opacity = '0';
                    alertBox.style.transition = 'opacity 0.5s ease-in-out';
                    document.body.appendChild(alertBox);
                    setTimeout(() => {
                        alertBox.style.opacity = '1';
                    }, 100);
                    setTimeout(() => {
                        alertBox.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(alertBox);
                        }, 500);
                    }, 2000);
                })
                .catch((err) => {
                    console.error("Failed to copy to clipboard:", err);
                });
        }

        function toggleConfig(button, show, hide) {
            const configContent = button.nextElementSibling;
            if (configContent.classList.contains('active')) {
                configContent.classList.remove('active');
                button.textContent = show;
            } else {
                configContent.classList.add('active');
                button.textContent = hide;
            }
        }
    <\/script>
</body>
</html>`;
    return htmlConfigs;
  } catch (error) {
    return `An error occurred while generating the VLESS configurations. ${error}`;
  }
}
function generateUUIDv4() {
  const randomValues = crypto.getRandomValues(new Uint8Array(16));
  randomValues[6] = randomValues[6] & 15 | 64;
  randomValues[8] = randomValues[8] & 63 | 128;
  return [
    randomValues[0].toString(16).padStart(2, "0"),
    randomValues[1].toString(16).padStart(2, "0"),
    randomValues[2].toString(16).padStart(2, "0"),
    randomValues[3].toString(16).padStart(2, "0"),
    randomValues[4].toString(16).padStart(2, "0"),
    randomValues[5].toString(16).padStart(2, "0"),
    randomValues[6].toString(16).padStart(2, "0"),
    randomValues[7].toString(16).padStart(2, "0"),
    randomValues[8].toString(16).padStart(2, "0"),
    randomValues[9].toString(16).padStart(2, "0"),
    randomValues[10].toString(16).padStart(2, "0"),
    randomValues[11].toString(16).padStart(2, "0"),
    randomValues[12].toString(16).padStart(2, "0"),
    randomValues[13].toString(16).padStart(2, "0"),
    randomValues[14].toString(16).padStart(2, "0"),
    randomValues[15].toString(16).padStart(2, "0")
  ].join("").replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}


async function vlessOverWSHandler(request) {
	const webSocketPair = new WebSocketPair();
	const [client, webSocket] = Object.values(webSocketPair);

	webSocket.accept();

	let address = '';
	let portWithRandomLog = '';
	const log = (info, event) => {
		console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
	};
	const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

	const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

	let remoteSocketWapper = {
		value: null,
	};
	let udpStreamWrite = null;
	let isDns = false;

	readableWebSocketStream.pipeTo(new WritableStream({
		async write(chunk, controller) {
			if (isDns && udpStreamWrite) {
				return udpStreamWrite(chunk);
			}
			if (remoteSocketWapper.value) {
				const writer = remoteSocketWapper.value.writable.getWriter()
				await writer.write(chunk);
				writer.releaseLock();
				return;
			}

			const {
				hasError,
				message,
				portRemote = 443,
				addressRemote = '',
				rawDataIndex,
				vlessVersion = new Uint8Array([0, 0]),
				isUDP,
			} = processVlessHeader(chunk);
			address = addressRemote;
			portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '
				} `;
			if (hasError) {
				throw new Error(message); 
				return;
			}
			if (isUDP) {
				if (portRemote === 53) {
					isDns = true;
				} else {
					throw new Error('UDP proxy only enable for DNS which is port 53');
					return;
				}
			}
			const vlessResponseHeader = new Uint8Array([vlessVersion[0], 0]);
			const rawClientData = chunk.slice(rawDataIndex);

			if (isDns) {
				const { write } = await handleUDPOutBound(webSocket, vlessResponseHeader, log);
				udpStreamWrite = write;
				udpStreamWrite(rawClientData);
				return;
			}
			handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, vlessResponseHeader, log);
		},
		close() {
			log(`readableWebSocketStream is close`);
		},
		abort(reason) {
			log(`readableWebSocketStream is abort`, JSON.stringify(reason));
		},
	})).catch((err) => {
		log('readableWebSocketStream pipeTo error', err);
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, vlessResponseHeader, log,) {
	async function connectAndWrite(address, port) {
		const tcpSocket = connect({
			hostname: address,
			port: port,
		});
		remoteSocket.value = tcpSocket;
		log(`connected to ${address}:${port}`);
		const writer = tcpSocket.writable.getWriter();
		await writer.write(rawClientData);
		writer.releaseLock();
		return tcpSocket;
	}

	async function retry() {
		const tcpSocket = await connectAndWrite(proxyIP.split(/[:=]/)[0] || addressRemote, proxyIP.split(/[:=]/)[1] || portRemote);
		tcpSocket.closed.catch(error => {
			console.log('retry tcpSocket closed error', error);
		}).finally(() => {
			safeCloseWebSocket(webSocket);
		})
		remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, null, log);
	}

	const tcpSocket = await connectAndWrite(addressRemote, portRemote);

	remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, retry, log);
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
	let readableStreamCancel = false;
	const stream = new ReadableStream({
		start(controller) {
			webSocketServer.addEventListener('message', (event) => {
				if (readableStreamCancel) {
					return;
				}
				const message = event.data;
				controller.enqueue(message);
			});
			webSocketServer.addEventListener('close', () => {
				safeCloseWebSocket(webSocketServer);
				if (readableStreamCancel) {
					return;
				}
				controller.close();
			}
			);
			webSocketServer.addEventListener('error', (err) => {
				log('webSocketServer has error');
				controller.error(err);
			}
			);
			const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
			if (error) {
				controller.error(error);
			} else if (earlyData) {
				controller.enqueue(earlyData);
			}
		},

		pull(controller) {
		},
		cancel(reason) {
			if (readableStreamCancel) {
				return;
			}
			log(`ReadableStream was canceled, due to ${reason}`)
			readableStreamCancel = true;
			safeCloseWebSocket(webSocketServer);
		}
	});

	return stream;

}
function processVlessHeader(
	vlessBuffer
) {
	if (vlessBuffer.byteLength < 24) {
		return {
			hasError: true,
			message: 'invalid data',
		};
	}
	const version = new Uint8Array(vlessBuffer.slice(0, 1));
	let isValidUser = true;
	let isUDP = false;
	if (!isValidUser) {
		return {
			hasError: true,
			message: 'invalid user',
		};
	}

	const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];

	const command = new Uint8Array(
		vlessBuffer.slice(18 + optLength, 18 + optLength + 1)
	)[0];
	if (command === 1) {
	} else if (command === 2) {
		isUDP = true;
	} else {
		return {
			hasError: true,
			message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
		};
	}
	const portIndex = 18 + optLength + 1;
	const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
	const portRemote = new DataView(portBuffer).getUint16(0);

	let addressIndex = portIndex + 2;
	const addressBuffer = new Uint8Array(
		vlessBuffer.slice(addressIndex, addressIndex + 1)
	);

	const addressType = addressBuffer[0];
	let addressLength = 0;
	let addressValueIndex = addressIndex + 1;
	let addressValue = '';
	switch (addressType) {
		case 1:
			addressLength = 4;
			addressValue = new Uint8Array(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			).join('.');
			break;
		case 2:
			addressLength = new Uint8Array(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + 1)
			)[0];
			addressValueIndex += 1;
			addressValue = new TextDecoder().decode(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			break;
		case 3:
			addressLength = 16;
			const dataView = new DataView(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				ipv6.push(dataView.getUint16(i * 2).toString(16));
			}
			addressValue = ipv6.join(':');
			break;
		default:
			return {
				hasError: true,
				message: `invild  addressType is ${addressType}`,
			};
	}
	if (!addressValue) {
		return {
			hasError: true,
			message: `addressValue is empty, addressType is ${addressType}`,
		};
	}

	return {
		hasError: false,
		addressRemote: addressValue,
		addressType,
		portRemote,
		rawDataIndex: addressValueIndex + addressLength,
		vlessVersion: version,
		isUDP,
	};
}

async function remoteSocketToWS(remoteSocket, webSocket, vlessResponseHeader, retry, log) {
	let remoteChunkCount = 0;
	let chunks = [];
	let vlessHeader = vlessResponseHeader;
	let hasIncomingData = false;
	await remoteSocket.readable
		.pipeTo(
			new WritableStream({
				start() {
				},
				async write(chunk, controller) {
					hasIncomingData = true;
					if (webSocket.readyState !== WS_READY_STATE_OPEN) {
						controller.error(
							'webSocket.readyState is not open, maybe close'
						);
					}
					if (vlessHeader) {
						webSocket.send(await new Blob([vlessHeader, chunk]).arrayBuffer());
						vlessHeader = null;
					} else {
						webSocket.send(chunk);
					}
				},
				close() {
					log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
				},
				abort(reason) {
					console.error(`remoteConnection!.readable abort`, reason);
				},
			})
		)
		.catch((error) => {
			console.error(
				`remoteSocketToWS has exception `,
				error.stack || error
			);
			safeCloseWebSocket(webSocket);
		});
	if (hasIncomingData === false && retry) {
		log(`retry`)
		retry();
	}
}

function base64ToArrayBuffer(base64Str) {
	if (!base64Str) {
		return { error: null };
	}
	try {
		base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
		const decode = atob(base64Str);
		const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
		return { earlyData: arryBuffer.buffer, error: null };
	} catch (error) {
		return { error };
	}
}


const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
function safeCloseWebSocket(socket) {
	try {
		if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
			socket.close();
		}
	} catch (error) {
		console.error('safeCloseWebSocket error', error);
	}
}

async function handleUDPOutBound(webSocket, vlessResponseHeader, log) {

	let isVlessHeaderSent = false;
	const transformStream = new TransformStream({
		start(controller) {

		},
		transform(chunk, controller) {
			for (let index = 0; index < chunk.byteLength;) {
				const lengthBuffer = chunk.slice(index, index + 2);
				const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
				const udpData = new Uint8Array(
					chunk.slice(index + 2, index + 2 + udpPakcetLength)
				);
				index = index + 2 + udpPakcetLength;
				controller.enqueue(udpData);
			}
		},
		flush(controller) {
		}
	});
	transformStream.readable.pipeTo(new WritableStream({
		async write(chunk) {
			const resp = await fetch('https://1.1.1.1/dns-query',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/dns-message',
					},
					body: chunk,
				})
			const dnsQueryResult = await resp.arrayBuffer();
			const udpSize = dnsQueryResult.byteLength;
			const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
			if (webSocket.readyState === WS_READY_STATE_OPEN) {
				log(`doh success and dns message length is ${udpSize}`);
				if (isVlessHeaderSent) {
					webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
				} else {
					webSocket.send(await new Blob([vlessResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
					isVlessHeaderSent = true;
				}
			}
		}
	})).catch((error) => {
		log('dns udp has error' + error)
	});

	const writer = transformStream.writable.getWriter();

	return {
		write(chunk) {
			writer.write(chunk);
		}
	};
}


async function trojanOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();
  let address = "";
  let portWithRandomLog = "";
  const log = (info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
  };
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream2(webSocket, earlyDataHeader, log);
  let remoteSocketWapper = {
    value: null,
  };
  let udpStreamWrite = null;
  readableWebSocketStream
    .pipeTo(
      new WritableStream({
        async write(chunk, controller) {
          if (udpStreamWrite) {
            return udpStreamWrite(chunk);
          }
          if (remoteSocketWapper.value) {
            const writer = remoteSocketWapper.value.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
            return;
          }
          const {
            hasError,
            message,
            portRemote = 443,
            addressRemote = "",
            rawClientData,
          } = await parseTrojanHeader(chunk);
          address = addressRemote;
          portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
          if (hasError) {
            throw new Error(message);
            return;
          }
          handleTCPOutBound2(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, log);
        },
        close() {
          log(`readableWebSocketStream is closed`);
        },
        abort(reason) {
          log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
        },
      })
    )
    .catch((err) => {
      log("readableWebSocketStream pipeTo error", err);
    });
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function parseTrojanHeader(buffer) {
  if (buffer.byteLength < 56) {
    return {
      hasError: true,
      message: "invalid data",
    };
  }
  let crLfIndex = 56;
  if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
    return {
      hasError: true,
      message: "invalid header format (missing CR LF)",
    };
  }

  const socks5DataBuffer = buffer.slice(crLfIndex + 2);
  if (socks5DataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid SOCKS5 request data",
    };
  }

  const view = new DataView(socks5DataBuffer);
  const cmd = view.getUint8(0);
  if (cmd !== 1) {
    return {
      hasError: true,
      message: "unsupported command, only TCP (CONNECT) is allowed",
    };
  }

  const atype = view.getUint8(1);
  let addressLength = 0;
  let addressIndex = 2;
  let address = "";
  switch (atype) {
    case 1:
      addressLength = 4;
      address = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + 1))[0];
      addressIndex += 1;
      address = new TextDecoder().decode(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      address = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${atype}`,
      };
  }

  if (!address) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${atype}`,
    };
  }

  const portIndex = addressIndex + addressLength;
  const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: address,
    portRemote,
    rawClientData: socks5DataBuffer.slice(portIndex + 4),
  };
}

async function handleTCPOutBound2(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, log) {
  async function connectAndWrite(address, port) {
    const tcpSocket2 = connect({
      hostname: address,
      port,
    });
    remoteSocket.value = tcpSocket2;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket2.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket2;
  }
  async function retry() {
    const tcpSocket2 = await connectAndWrite(proxyIP.split(/[:=]/)[0] || addressRemote, proxyIP.split(/[:=]/)[1] || portRemote);
    tcpSocket2.closed
      .catch((error) => {
        console.log("retry tcpSocket closed error", error);
      })
      .finally(() => {
        safeCloseWebSocket2(webSocket);
      });
    remoteSocketToWS2(tcpSocket2, webSocket, null, log);
  }
  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  remoteSocketToWS2(tcpSocket, webSocket, retry, log);
}

function makeReadableWebSocketStream2(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message = event.data;
        controller.enqueue(message);
      });
      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket2(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer2(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {},
    cancel(reason) {
      if (readableStreamCancel) {
        return;
      }
      log(`readableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket2(webSocketServer);
    },
  });
  return stream;
}

async function remoteSocketToWS2(remoteSocket, webSocket, retry, log) {
  let hasIncomingData = false;
  await remoteSocket.readable
    .pipeTo(
      new WritableStream({
        start() {},
        async write(chunk, controller) {
          hasIncomingData = true;
          if (webSocket.readyState !== WS_READY_STATE_OPEN) {
            controller.error("webSocket connection is not open");
          }
          webSocket.send(chunk);
        },
        close() {
          log(`remoteSocket.readable is closed, hasIncomingData: ${hasIncomingData}`);
        },
        abort(reason) {
          console.error("remoteSocket.readable abort", reason);
        },
      })
    )
    .catch((error) => {
      console.error(`remoteSocketToWS2 error:`, error.stack || error);
      safeCloseWebSocket2(webSocket);
    });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

function base64ToArrayBuffer2(base64Str) {
  if (!base64Str) {
    return { error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

let WS_READY_STATE_OPEN2 = 1;
let WS_READY_STATE_CLOSING2 = 2;

function safeCloseWebSocket2(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN2 || socket.readyState === WS_READY_STATE_CLOSING2) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket2 error", error);
  }
}

export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

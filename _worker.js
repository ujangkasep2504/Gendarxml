import { connect } from "cloudflare:sockets";

let isApiReady = false;
let proxyIP = "103.186.1.209:2053";
let cachedProxyList = [];

async function getProxyList() {
  const proxyBankUrl = "https://raw.githubusercontent.com/jaka2m/worker/main/output.txt"; // Tetap menggunakan proxyBankUrl
  try {
    const proxyBank = await fetch(proxyBankUrl);
    if (proxyBank.status === 200) {
      const text = (await proxyBank.text()) || "";
      const proxyString = text.split("\n").filter(Boolean);
      cachedProxyList = proxyString.map((entry) => {
        const [proxyIP, proxyPort, country, org] = entry.split(",");
        return {
          proxyIP: proxyIP || "Unknown",
          proxyPort: proxyPort || "Unknown",
          country: country || "Unknown",
          org: org || "Unknown Org",
        };
      }).filter(Boolean); 
    }
    return cachedProxyList; 
  } catch (error) {
    console.error("Error fetching proxy list:", error.message);
    return cachedProxyList; 
  }
}

function buildCountryFlag() {
  const flagList = [];
  for (const proxy of cachedProxyList) {
    flagList.push(proxy.country);
  }

  let flagElement = "";
for (const flag of new Set(flagList)) {
  flagElement += `<a href="/?cc=${flag}" class="py-1">
                    <img width="20" src="https://flagcdn.com/h80/${flag.toLowerCase()}.png" />
                  </a>`;
}

this.html = this.html.replaceAll("BENDERA", flagElement);

}

function getAllConfig(request, hostName, proxyList, page = 0) {
  const startIndex = 50 * page;

  try {
    const uuid = crypto.randomUUID();
    const ports = [443, 80];
    const protocols = ["trojan", "vless", "ss"];

    const uri = new URL(`trojan://${hostName}`);
    uri.searchParams.set("encryption", "none");
    uri.searchParams.set("type", "ws");
    uri.searchParams.set("host", hostName);

    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Geo Project</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body class="bg-light">
    <div class="container py-5">
        <!-- Header Section -->
        <div class="text-center mb-4">
            <div style="position: fixed; top: 10px; width: 100%; z-index: 1000;" class="text-center">
    <h1 class="display-5 fw-bold text-primary">
    <a href="https://t.me/sampiiiiu" target="_blank" class="text-decoration-none">
        GEO PROJECT
    </a>
</h1>
<div class="card-body">
    <form action="/" method="get" class="d-flex justify-content-center align-items-center">
        <input 
            type="text" 
            id="country" 
            name="cc" 
            placeholder="Enter Country Code (e.g., US)" 
            class="form-control me-2 w-50 shadow-sm text-center"
        />
        <button type="submit" id="search-button" class="btn btn-primary shadow-sm">
            <i class="bi bi-search"></i> Search
        </button>
    </form>
</div>
</div>
</div>
</div>
      <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th>IP:PORT</th>
                                <th>STATUS</th>
                                <th>COUNTRY</th>
                                <th>ISP</th>
                                <th>VLESS</th>
                                <th>TROJAN</th>
                                <th>SHADOWSOCKS</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

    for (let i = startIndex; i < startIndex + 50; i++) {
      const proxy = proxyList[i];
      if (!proxy) break;

      const { proxyIP, proxyPort, country, org } = proxy;
      const ipPort = `${proxyIP}:${proxyPort}`;
      const Status = `https://ipcf.vlessipcf.us.kg/key=geo/ip=${proxyIP}:${proxyPort}`;

      const uriWithPath = new URL(uri);
      uriWithPath.searchParams.set("path", `/${proxyIP}-${proxyPort}`);
      uriWithPath.hash = `${country} ${org}`;

      const proxies = [];
      for (const port of ports) {
        uriWithPath.port = port.toString();
        for (const protocol of protocols) {
          if (protocol === "ss") {
            uriWithPath.username = btoa(`none:${uuid}`);
          } else {
            uriWithPath.username = uuid;
          }

          uriWithPath.protocol = protocol;
          uriWithPath.searchParams.set("security", port == 443 ? "tls" : "none");
          uriWithPath.searchParams.set("sni", port == 80 && protocol == "vless" ? "" : hostName);

          proxies.push(uriWithPath.toString());
        }
      }

      htmlContent += `
                       <tr class="text-center">
                                <td class="fw-bold">${ipPort}</td>
                                <td id="status-${proxyIP}-${proxyPort}">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                                <td>
                                    ${country} 
                                    <img width="24" src="https://flagcdn.com/h80/${country.toLowerCase()}.png" alt="Flag" class="ms-2 rounded">
                                </td>
                                <td>${org}</td>
                                <td>
                                    <button class="btn btn-outline-primary btn-sm" onclick="showOptions('VLess', '${proxies[1]}', '${proxies[4]}')">
                                        <i class="bi bi-box-arrow-up-right"></i> VLESS
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-outline-danger btn-sm" onclick="showOptions('Trojan', '${proxies[0]}', '${proxies[3]}')">
                                        <i class="bi bi-shield-lock"></i> TROJAN
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-outline-success btn-sm" onclick="showOptions('Shadowsocks', '${proxies[2]}', '${proxies[5]}')">
                                        <i class="bi bi-lightning-charge"></i> SHADOWSOCKS
                                    </button>
                                </td>
                            </tr>
        <script>
            function showOptions(type, tls, ntls) {
    Swal.fire({
        icon: 'question',
        width: '270px',
        html: \`
            <div style="height: 1px; background-color: #4682b4; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
            <div style="font-size: 13px;">IP : ${ipPort}</div>
            <div style="font-size: 13px;">ISP : ${org}</div>
            <div style="font-size: 13px;">Country : ${country} <img width="20" src="https://flagcdn.com/h80/${country.toLowerCase()}.png" /></div>
            <div style="height: 1px; background-color: #4682b4; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
            <br>
            <button class="btn btn-success btn-sm" onclick="copyToClipboard('\${tls}')">Copy TLS</button>
            <button class="btn btn-success btn-sm" onclick="copyToClipboard('\${ntls}')">Copy NTLS</button>
            <div style="margin-top: 13px;">
                <button class="btn btn-danger btn-sm" onclick="Swal.close()">Close</button>
            </div>
        \`,
         showCloseButton: false,
        showConfirmButton: false,
        background: 'rgba(6, 18, 67, 0.70)',
        imageUrl: "https://raw.githubusercontent.com/jaka2m/mau/refs/heads/kepo/assets/img/logo.jpg",
  imageHeight: 201,
  imageWidth: 201,
        color: 'white',
        customClass: {
            popup: 'rounded-popup',
            closeButton: 'close-btn'
        }
    });
}

            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    Swal.fire({
                        title: 'Berhasil!',
                        width: '270px',
                        text: 'Teks berhasil disalin ke clipboard.',
                        icon: 'success',
                        background: 'rgba(6, 18, 67, 0.70)',
                        color: 'white',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }).catch(err => {
                    Swal.fire('Error!', 'Gagal menyalin teks.', 'error');
                });
            }
        </script>
        <script>
          fetch('${Status}')
            .then(response => response.json())
            .then(data => {
              const statusElement = document.getElementById('status-${proxyIP}-${proxyPort}');
              const { proxyStatus, ip, asn, isp, country, city, port } = data;
              
              if (proxyStatus === 'ACTIVE') {
    statusElement.textContent = 'ACTIVE';
    statusElement.style.color = '#00FF00'; 
    statusElement.style.fontSize = '14px'; 
    statusElement.style.fontWeight = 'bold'; 
} else if (proxyStatus === 'DEAD') {
    statusElement.textContent = 'DEAD';
    statusElement.style.color = '#FF3333'; 
    statusElement.style.fontSize = '14px'; 
    statusElement.style.fontWeight = 'bold'; 
}

            })
            .catch(error => {
              const statusElement = document.getElementById('status-${proxyIP}-${proxyPort}');
              statusElement.textContent = 'Error';
              statusElement.style.color = 'cyan';
            });
        </script>
       
`;
    }
    
    // Pagination
    htmlContent += `
      </tbody>
      </table>
      </div>
      <div style="position: fixed; bottom: 20px; width: 100%; z-index: 1000;">
    <div class="container">
        <div class="row justify-content-center text-center">
            <div class="col-auto">
                <a href="/?page=${page > 0 ? page - 1 : 0}" class="btn btn-outline-primary btn-sm rounded-pill me-2">
                    <i class="bi bi-chevron-left"></i> Prev
                </a>
                <span class="fw-bold mx-2">Page ${page + 1}</span>
                <a href="/?page=${page + 1}" class="btn btn-outline-primary btn-sm rounded-pill ms-2">
                    Next <i class="bi bi-chevron-right"></i>
                </a>
            </div>
        </div>
    </div>
</div>
</body>
</html>

      `;

    return htmlContent;
  } catch (error) {
    return `An error occurred while generating the VLESS configurations. ${error}`;
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const upgradeHeader = request.headers.get("Upgrade");

      if (upgradeHeader === "websocket") {
        const proxyMatch = url.pathname.match(/^\/(.+[:=-]\d+)$/);

        if (proxyMatch) {
          const proxyIP = proxyMatch[1];
          return await websockerHandler(request);
        }
      }

      // Handle requests to the root path
      if (url.pathname === "/") {
        const pageIndex = parseInt(url.searchParams.get("page") || "0"); // Read `page` query parameter
        const hostname = request.headers.get("Host");

        // Queries
        const countrySelect = url.searchParams.get("cc")?.split(",");
        const proxyBankUrl = url.searchParams.get("proxy-list"); // Expect the proxy list from query params
        let proxyList = (await getProxyList(proxyBankUrl)).filter((proxy) => {
          // Filter proxies by Country
          if (countrySelect) {
            return countrySelect.includes(proxy.country);
          }

          return true;
        });

        const result = getAllConfig(request, hostname, proxyList, pageIndex);

        if (request.headers.get("Accept")?.includes("text/html")) {
          return new Response(result, {
            status: 200,
            headers: { "Content-Type": "text/html;charset=utf-8" },
          });
        }

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Max-Age": "86400",
            "Content-Type": "application/json",
          },
        });
      }

      // Default response for unsupported paths
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      return new Response("Error processing request", { status: 500 });
    }
  },
};

async function websockerHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);

  webSocket.accept();

  let addressLog = "";
  let portLog = "";
  const log = (info, event) => {
    console.log(`[${addressLog}:${portLog}] ${info}`, event || "");
  };
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";

  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

  let remoteSocketWrapper = {
    value: null,
  };
  let udpStreamWrite = null;
  let isDNS = false;

  readableWebSocketStream
    .pipeTo(
      new WritableStream({
        async write(chunk, controller) {
          if (isDNS && udpStreamWrite) {
            return udpStreamWrite(chunk);
          }
          if (remoteSocketWrapper.value) {
            const writer = remoteSocketWrapper.value.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
            return;
          }

          const protocol = await protocolSniffer(chunk);
          let protocolHeader;

          if (protocol === "Trojan") {
            protocolHeader = parseTrojanHeader(chunk);
          } else if (protocol === "VLESS") {
            protocolHeader = parseVlessHeader(chunk);
          } else if (protocol === "Shadowsocks") {
            protocolHeader = parseShadowsocksHeader(chunk);
          } else {
            parseVmessHeader(chunk);
            throw new Error("Unknown Protocol!");
          }

          addressLog = protocolHeader.addressRemote;
          portLog = `${protocolHeader.portRemote} -> ${protocolHeader.isUDP ? "UDP" : "TCP"}`;

          if (protocolHeader.hasError) {
            throw new Error(protocolHeader.message);
          }

          if (protocolHeader.isUDP) {
            if (protocolHeader.portRemote === 53) {
              isDNS = true;
            } else {
              throw new Error("UDP only support for DNS port 53");
            }
          }

          if (isDNS) {
            const { write } = await handleUDPOutbound(webSocket, protocolHeader.version, log);
            udpStreamWrite = write;
            udpStreamWrite(protocolHeader.rawClientData);
            return;
          }

          handleTCPOutBound(
            remoteSocketWrapper,
            protocolHeader.addressRemote,
            protocolHeader.portRemote,
            protocolHeader.rawClientData,
            webSocket,
            protocolHeader.version,
            log
          );
        },
        close() {
          log(`readableWebSocketStream is close`);
        },
        abort(reason) {
          log(`readableWebSocketStream is abort`, JSON.stringify(reason));
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

async function protocolSniffer(buffer) {
  if (buffer.byteLength >= 62) {
    const trojanDelimiter = new Uint8Array(buffer.slice(56, 60));
    if (trojanDelimiter[0] === 0x0d && trojanDelimiter[1] === 0x0a) {
      if (trojanDelimiter[2] === 0x01 || trojanDelimiter[2] === 0x03 || trojanDelimiter[2] === 0x7f) {
        if (trojanDelimiter[3] === 0x01 || trojanDelimiter[3] === 0x03 || trojanDelimiter[3] === 0x04) {
          return "Trojan";
        }
      }
    }
  }

  const vlessDelimiter = new Uint8Array(buffer.slice(1, 17));
  // Hanya mendukung UUID v4
  if (arrayBufferToHex(vlessDelimiter).match(/^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i)) {
    return "VLESS";
  }

  return "Shadowsocks"; // default
}

async function handleTCPOutBound(
  remoteSocket,
  addressRemote,
  portRemote,
  rawClientData,
  webSocket,
  responseHeader,
  log
) {
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
    const tcpSocket = await connectAndWrite(
      proxyIP.split(/[:=-]/)[0] || addressRemote,
      proxyIP.split(/[:=-]/)[1] || portRemote
    );
    tcpSocket.closed
      .catch((error) => {
        console.log("retry tcpSocket closed error", error);
      })
      .finally(() => {
        safeCloseWebSocket(webSocket);
      });
    remoteSocketToWS(tcpSocket, webSocket, responseHeader, null, log);
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);

  remoteSocketToWS(tcpSocket, webSocket, responseHeader, retry, log);
}

async function handleUDPOutbound(webSocket, responseHeader, log) {
  let isVlessHeaderSent = false;
  const transformStream = new TransformStream({
    start(controller) {},
    transform(chunk, controller) {
      for (let index = 0; index < chunk.byteLength; ) {
        const lengthBuffer = chunk.slice(index, index + 2);
        const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
        const udpData = new Uint8Array(chunk.slice(index + 2, index + 2 + udpPakcetLength));
        index = index + 2 + udpPakcetLength;
        controller.enqueue(udpData);
      }
    },
    flush(controller) {},
  });
  transformStream.readable
    .pipeTo(
      new WritableStream({
        async write(chunk) {
          const resp = await fetch("https://1.1.1.1/dns-query", {
            method: "POST",
            headers: {
              "content-type": "application/dns-message",
            },
            body: chunk,
          });
          const dnsQueryResult = await resp.arrayBuffer();
          const udpSize = dnsQueryResult.byteLength;
          const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
          if (webSocket.readyState === 1) {
            log(`doh success and dns message length is ${udpSize}`);
            if (isVlessHeaderSent) {
              webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
            } else {
              webSocket.send(await new Blob([responseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
              isVlessHeaderSent = true;
            }
          }
        },
      })
    )
    .catch((error) => {
      log("dns udp has error" + error);
    });

  const writer = transformStream.writable.getWriter();

  return {
    write(chunk) {
      writer.write(chunk);
    },
  };
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
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
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer has error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
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
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    },
  });

  return stream;
}

function parseVmessHeader(vmessBuffer) {
  // https://xtls.github.io/development/protocols/vmess.html#%E6%8C%87%E4%BB%A4%E9%83%A8%E5%88%86
}

function parseShadowsocksHeader(ssBuffer) {
  const view = new DataView(ssBuffer);

  const addressType = view.getUint8(0);
  let addressLength = 0;
  let addressValueIndex = 1;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `Invalid addressType for Shadowsocks: ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `Destination address empty, address type is: ${addressType}`,
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = ssBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: portIndex + 2,
    rawClientData: ssBuffer.slice(portIndex + 2),
    version: null,
    isUDP: portRemote == 53,
  };
}

function parseVlessHeader(vlessBuffer) {
  const version = new Uint8Array(vlessBuffer.slice(0, 1));
  let isUDP = false;

  const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];

  const cmd = new Uint8Array(vlessBuffer.slice(18 + optLength, 18 + optLength + 1))[0];
  if (cmd === 1) {
  } else if (cmd === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `command ${cmd} is not support, command 01-tcp,02-udp,03-mux`,
    };
  }
  const portIndex = 18 + optLength + 1;
  const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(vlessBuffer.slice(addressIndex, addressIndex + 1));

  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = "";
  switch (addressType) {
    case 1: // For IPv4
      addressLength = 4;
      addressValue = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 2: // For Domain
      addressLength = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3: // For IPv6
      addressLength = 16;
      const dataView = new DataView(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
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
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    rawClientData: vlessBuffer.slice(addressValueIndex + addressLength),
    version: new Uint8Array([version[0], 0]),
    isUDP: isUDP,
  };
}

function parseTrojanHeader(buffer) {
  const socks5DataBuffer = buffer.slice(58);
  if (socks5DataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid SOCKS5 request data",
    };
  }

  let isUDP = false;
  const view = new DataView(socks5DataBuffer);
  const cmd = view.getUint8(0);
  if (cmd == 3) {
    isUDP = true;
  } else if (cmd != 1) {
    throw new Error("Unsupported command type!");
  }

  let addressType = view.getUint8(1);
  let addressLength = 0;
  let addressValueIndex = 2;
  let addressValue = "";
  switch (addressType) {
    case 1: // For IPv4
      addressLength = 4;
      addressValue = new Uint8Array(socks5DataBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(
        "."
      );
      break;
    case 3: // For Domain
      addressLength = new Uint8Array(socks5DataBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(
        socks5DataBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
      );
      break;
    case 4: // For IPv6
      addressLength = 16;
      const dataView = new DataView(socks5DataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${addressType}`,
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: portIndex + 4,
    rawClientData: socks5DataBuffer.slice(portIndex + 4),
    version: null,
    isUDP: isUDP,
  };
}

async function remoteSocketToWS(remoteSocket, webSocket, responseHeader, retry, log) {
  let header = responseHeader;
  let hasIncomingData = false;
  await remoteSocket.readable
    .pipeTo(
      new WritableStream({
        start() {},
        async write(chunk, controller) {
          hasIncomingData = true;
          if (webSocket.readyState !== 1) {
            controller.error("webSocket.readyState is not open, maybe close");
          }
          if (header) {
            webSocket.send(await new Blob([header, chunk]).arrayBuffer());
            header = null;
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
      console.error(`remoteSocketToWS has exception `, error.stack || error);
      safeCloseWebSocket(webSocket);
    });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === 1 || socket.readyState === 2) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}


// Helpers
function base64ToArrayBuffer(base64Str) {
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

function arrayBufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

class ProxyManager {
  constructor() {
    this.proxies = [];
  }

  async generateHashFromText(text) {
    const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("MD5", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string

    return hashHex;
  }

  registerProxies(data, proxies) {
    this.proxies.push({
      ...data,
      list: proxies,
    });
  }
}

const proxyManager = new ProxyManager();

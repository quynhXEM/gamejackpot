(function () {
    const urlAction = {
        bet: "https://bet.nguyenxuanquynh1812nc1.workers.dev/",
        get_game: "https://get-game.nguyenxuanquynh1812nc1.workers.dev/",
        block: "https://block.nguyenxuanquynh1812nc1.workers.dev/",
        block_info: "https://block-info.nguyenxuanquynh1812nc1.workers.dev/"
    }
    const containerId = 'jackpot-game-widget';
    let container = document.getElementById(containerId);
    if (!container) {
        console.error("Widget need 'jackpot-game-widget' box id")
        return;
    }

    const slug = container.getAttribute("data-id") || null;
    const color = {
        red: "#FF3F3F",
        green: "#00D335",
        blue: "#15B1FF",
        orange: "#FFC30F",
        top_neon: '#129DFF',
        bot_neon: '#00CCFE',
        btn_dis: '#393C65'
    }
    const network = [
        {
            "name": "Ethereum",
            "chain_id": 1,
            "api_explorer": "https://api.etherscan.io/v2/api",
            "api_url": "https://mainnet.infura.io/v3"
        },
        {
            "name": "Binance Smart Chain",
            "chain_id": 56,
            "api_url": "https://bsc-testnet.infura.io/v3",
            "api_explorer": "https://api.bscscan.com/api"
        },
        {
            "name": "Polygon",
            "chain_id": 137,
            "api_explorer": "https://api.polygonscan.com/api",
            "api_url": "https://polygon-mainnet.infura.io/v3"
        },
        {
            "name": "Avalanche (Coming Soon)",
            "chain_id": 43114,
            "api_explorer": "https://snowtrace.io",
            "api_url": "https://avalanche-mainnet.infura.io/v3"
        },
        {
            "name": "Arbitrum One",
            "chain_id": 42161,
            "api_explorer": "https://api.arbiscan.io/api",
            "api_url": "https://arbitrum-mainnet.infura.io/v3"
        },
        {
            "name": "Optimism Ethescan",
            "chain_id": 10,
            "api_explorer": "https://api-optimistic.etherscan.io/api",
            "api_url": "https://optimism-mainnet.infura.io/v3"
        },
        {
            "name": "Celo",
            "chain_id": 42220,
            "api_explorer": "https://api.celoscan.io/api",
            "api_url": "https://celo-mainnet.infura.io/v3"
        },
        {
            "name": "Ethereum Sepolia Testnet",
            "chain_id": 11155111,
            "api_explorer": "https://api-sepolia.etherscan.io/api",
            "api_url": "https://sepolia.infura.io/v3"
        },
        {
            "name": "BSC Testnet",
            "chain_id": 97,
            "api_explorer": "https://api-testnet.bscscan.com/api",
            "api_url": "https://bsc-testnet.infura.io/v3"
        },
        {
            "name": "Avalanche Fuji Testnet (Coming Soon)",
            "chain_id": 43113,
            "api_explorer": "https://testnet.snowtrace.io",
            "api_url": "https://avalanche-fuji.infura.io/v3"
        },
        {
            "name": "Fantom",
            "chain_id": 250,
            "api_explorer": "https://api.ftmscan.com/api",
            "api_url": "https://rpc.ftm.tools"
        },
        {
            "name": "Cronos",
            "chain_id": 25,
            "api_explorer": "https://api.cronoscan.com/api",
            "api_url": "https://evm.cronos.org"
        },
        {
            "name": "Moonbeam",
            "chain_id": 1284,
            "api_explorer": "https://api-moonbeam.moonscan.io/api",
            "api_url": "https://1rpc.io/glmr"
        },
        {
            "name": "Moonbase Alpha Testnet",
            "chain_id": 1287,
            "api_explorer": "https://api-moonbase.moonscan.io/api",
            "api_url": "https://rpc.testnet.moonbeam.network"
        }
    ]

    // variable
    let gameData;
    let histories = [];
    let hisData = [];
    let hisIndex = -1
    let Ssocket;
    let singer_wallet;
    let NumberBtn = Array(100).fill().map((_, i) => ({ number: (`0${i}`).slice(-2), status: false }));
    let currentWallet;
    let total_bet = 0;
    let current_block;
    // Hàm xử lý 
    function Image(id) {
        return `https://soc.bitrefund.co/assets/${id}`
    }

    function betBlock(current) {
        return Number(current) + 2
    }

    async function data_game() {
        const data = await fetch(`https://get-game.nguyenxuanquynh1812nc1.workers.dev/${slug}`, {
            method: "GET"
        })
            .then((data) => data.json())
            .then((data) => {
                return data.data?.[0]
            })
            .catch((err) => {
                return null
            })


        const providerUrl = getNetwork(data.chain_id).api_url + "/379175b6c6c3436eab583d759cdeea5e"

        function sendRpcRequest(method, params) {
            return new Promise((resolve, reject) => {
                const requestData = {
                    jsonrpc: "2.0",
                    id: 1,
                    method: method,
                    params: params
                };

                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                };

                fetch(providerUrl, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            reject(data.error);
                        } else {
                            resolve(data.result);
                        }
                    })
                    .catch(error => reject(error));
            });
        }

        function decodeFromHex(hex) {
            const hexStr = hex.slice(2);
            let decodedStr = '';
            for (let i = 0; i < hexStr.length; i += 2) {
                decodedStr += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
            }
            return decodedStr.replace(/[\x00-\x1F\x7F]/g, '');
        }

        async function getTokenData() {
            const symbol = await Promise.all([
                sendRpcRequest("eth_call", [{
                    to: data.contract_address,
                    data: "0x95d89b41"
                }, "latest"])
            ])
                .then(([symbol]) => {
                    const tokenSymbol = decodeFromHex(symbol);
                    return tokenSymbol
                })

            return { symbol, ...data }
        }
        const reponse = await getTokenData()
        return reponse
    }

    function getNetwork(chain_id) {
        return network.find((item) => item.chain_id == chain_id);
    };

    function mathToken(NumberBtn) {
        document.getElementById('play-widget').innerText = "Play " + NumberBtn.filter((item) => item.status).length * Number(document.getElementById('input-widget').value) + gameData.symbol
    }

    function renderTotal(total_bet) {
        return new Intl.NumberFormat('de-DE').format(total_bet) + " " + gameData.symbol
    }

    // Connect server
    async function getBlock() {
        current_block = await fetch("https://block.nguyenxuanquynh1812nc1.workers.dev/", {
            method: "GET",
        })
            .then((reponse) => reponse.json())
            .then((data) => data)
            .catch((err) => {
                // console.log("ERR ===", err)
                return false;
            })

        if (!current_block) {
            window.location.reload()
        }
    }

    function connectBlockChain() {
        const socket = new WebSocket('wss://ws.blockchain.info/inv');

        socket.onopen = function (event) {
            socket.send(JSON.stringify({ op: "blocks_sub" }));
        };

        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            if (data.op === "block") {
                current_block = data.x
                const block = document.getElementById('current-block')
                total_bet = 0
                const bet = document.getElementById('count_bet')
                bet.innerText = renderTotal(total_bet)
                block.textContent = "#" + betBlock(current_block.height)

                window.location.reload()
            }
        };

        socket.onclose = function (event) {
            connectBlockChain()
        };

        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };
    }

    function connectGamedata() {
        Ssocket = new WebSocket('wss://soc.bitrefund.co/websocket')

        Ssocket.onopen = function (event) {
            Ssocket.send(JSON.stringify({
                type: "auth",
                access_token: "vj0N9mA85sds38EnokvhkKl1uK5T83Px"
            }))
        }
        Ssocket.onmessage = function (event) {
            const response = JSON.parse(event.data);
            switch (response.type) {
                case 'auth':
                    if (response.status === 'ok') {
                        Ssocket.send(
                            JSON.stringify({
                                type: 'subscribe',
                                collection: 'bet',
                                query: {
                                    filter: {
                                        "game_id": {
                                            "_eq": gameData.id
                                        }
                                    },
                                    fields: [
                                        '*',
                                    ]
                                }
                            })
                        )
                    }
                    break;
                case 'subscription':
                    const { data } = response;
                    const count_bet = document.getElementById('count_bet')
                    switch (response.event) {
                        case 'init':
                            historyData(data.filter(item => item.status != 'waiting_result'))
                            hisData = data.filter(item => item.status != 'waiting_result')
                            total_bet = data.filter(item => item.block_height == betBlock(current_block.height))
                                .reduce((total, item) => total + (Number(item.bet_amount) || 0), 0)
                            count_bet.textContent = renderTotal(total_bet)
                            break;
                        case 'create':
                            total_bet += data.filter(item => item.block_height == betBlock(current_block.height))
                                .reduce((total, item) => total + (Number(item.bet_amount) || 0), 0)
                            count_bet.textContent = renderTotal(total_bet)
                            break;
                        case 'delete':
                            break;
                        case 'update':
                            break;
                        default:
                            break;
                    }
                    break;
                case 'ping':
                    Ssocket.send(
                        JSON.stringify({
                            type: 'pong',
                        })
                    )
                    break;
                default:
                    break;
            }
        };

        Ssocket.onclose = function () {
            // console.log("Disconnect Ssocket");

        }
        Ssocket.onerror = function () {
            // console.log("Connect Ssocket faild. Reconnecting.....");
            connectGamedata()
        }
    }

    // History
    function historyData(data) {
        const groupedByBlock = {};
        data.forEach(item => {
            if (!groupedByBlock[item.block_height]) {
                groupedByBlock[item.block_height] = {
                    block_height: item.block_height,
                    total: 0,
                    bet: 0,
                    total_num_win: 0,
                    numbers: [],
                    result: item.result
                };
            }
            // Tính tổng bet_amount cho mỗi block
            groupedByBlock[item.block_height].total += parseFloat(item.bet_amount);
            groupedByBlock[item.block_height].total_num_win += parseFloat(item.result == item.choice ? item.bet_amount : 0)
            // Kiểm tra nếu wallet address trùng với input
            if (item.wallet_address === currentWallet) {
                groupedByBlock[item.block_height].bet += parseFloat(item.bet_amount);

                // Tổng hợp danh sách số đã cược
                const existingNumber = groupedByBlock[item.block_height].numbers.find(n => n.number === item.choice);
                if (existingNumber) {
                    existingNumber.amount += parseFloat(item.bet_amount);
                } else {
                    groupedByBlock[item.block_height].numbers.push({ number: item.choice, amount: parseFloat(item.bet_amount) });
                }
            }
        });

        // Chuyển đổi kết quả sang mảng và sắp xếp theo block_height giảm dần
        histories = Object.values(groupedByBlock).sort((a, b) => a.block_height - b.block_height);

        histories.forEach((item, index) => {
            histories[index].total += parseFloat(histories[index - 1]?.total_num_win == 0 ? (histories[index - 1]?.total || 0) : 0)
        })

        histories.sort((a, b) => b.block_height - a.block_height);
    }

    // Load JS
    function import_js() {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js";
        document.head.appendChild(script);

        const links = [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&display=swap" }
        ];

        links.forEach(attrs => {
            const link = document.createElement("link");
            Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
            document.head.appendChild(link);
        });


        const script_wallet = document.createElement("script");
        script_wallet.src = "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js";
        document.head.appendChild(script_wallet);
    }

    // UI
    function GenarateUI() {
        const style = document.createElement('style');
        const script = document.createElement('script');
        script.src = `https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs`;
        script.type = 'module';
        style.textContent = `
            html {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            * {
                padding: 0;
                border: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
                
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .merienda-text-widget {
                font-family: "Merienda", serif;
                font-optical-sizing: auto;
                font-weight: 700;
                font-style: normal;
                margin: 0px;
            }

            .btn-wallet-widget {
                background: #FFC30F;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: opacity 0.3s;
                width: 100%;
                justify-content: center;
            }
            .btn-wallet-text-widget {
                color: white;
                text-wrap: nowrap;
            }

            .bg-modal-widget {
                margin: 0;
                padding:0;
                position: absolute;
                top: 0;
                background-color: rgba(0, 0, 0, 0.5); 
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                over-flow: hilden;
            }
            .none {
                display: none;
            }
            .block {
                display: block;
            }
           .card-modal-widget {
                background-color: white;
                flex:1;
                display: flex;
                overflow: hidden;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                border-radius: 10px;
            }
            .tilte-modal-widget {
                font-family: "Merienda", serif;
                font-weight: 700;
                font-size: 1.5rem;
                color: black;
                margin: 10px;
                text-align: center;
            }
            .content-modal-his-widget {
                flex: 1;
                max-height: 500px;
                display: flex;
                overflow-x: scroll;
                flex-wrap: wrap;
                gap: 5px;
                padding: 10px;
                justify-content: center;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .content-modal-widget {
                flex: 1;
                max-height: 500px;
                display: flex;
                overflow-x: scroll;
                flex-direction: column;
                gap: 5px;
                padding: 10px;
                justify-content: left;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .content-modal-widget p, h3, ul, li {
                font-family: "Merienda", serif;
                color: black;
                margin: 5px;
            }
            .text-highlight-widget {
                font-weight: bold;
                color: #ff5722;
                font-family: "Merienda", serif;
            }


            .action-div-widget{
                width: 100%;
                display: flex;
                padding: 5px 0px;
                flex-direction: row;
                justify-content: space-between;
                gap: 5px;
                font-size: 32px;
                margin: 0px;
                color: white;
                align-items: center;
                font-family: "Merienda", serif;
            }
            .action-btn-widget {
                width: 35px;
                height: 35px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
                cursor: pointer;
            }
            .history-btn-widget {
                background-color: white;
            }
            .his-icon-widget {
                width: 20px;
                height: 20px;
            }
            .info-btn-widget {
                background-color: #15B1FF;
                text-align: center;
                color: white;
                font-family: "Merienda", serif;
                font-weight: 700;
                font-size: 20px;
                margin-right: 5px
            }

            .ctn-pig-widget {
                width: 100%;
                display: flex;
                position: relative;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .ctn-jackpot-widget {
                padding: 5px 10px;
                position: absolute;
                border-radius: 360px;
                bottom: 10px;
                width: 30%;
                text-align: center;
                background-color: white;
                color: ${color.orange};
                font-family: "Merienda", serif;
                font-weight: 700;
                margin: 0px;
                border: 2px solid #00CCFE;
                text-wrap: none;
                transaction: 
            }

            .num-ctn-widget {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-evenly;
            }
            .num-ct-widget {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                padding: 20px;
                overflow-y: scroll;
                // max-height: 430px;
                max-width: 1020px;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .card-ctn-bet {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-evenly;
                margin-top: 20px;
                
            }
            .card-ct-bet {
                background-color: #2B2F5F;
                display: flex;
                flex-wrap: wrap;
                border-radius: 5px;
                gap: 10px;
                padding: 10px;
                overflow-y: scroll;
                max-height: 230px;
                max-width: 1020px;
                width: 100%;
                scrollbar-width: none;
                -ms-overflow-style: none; 
            }

            .group-actbtn-widget {
                display: flex;
                flex: 1;
                flex-direction: row;
                justify-content: space-between;
                gap: 10px;
                max-width: 1020px;
            }

            .auto-select-widget {
                background-color: ${color.red}
            }

            .remove-widget {
                background-color: gray
            }

            .btn-bet-widget {
                width: 49%;
                padding: 10px;
                color: white;
                font-family: "Merienda", serif;
                font-weight: 700;
                outline: none;
                border 0px;
                cursor: pointer;
            }

            .text-black {
                color: black;
            }

            .top-widget {
                gap: 20px; display: flex; flex-direction: row; width: 100%;
            }

            .input-widget {
                width: 100%;
            }

            @keyframes moveBackground {
                0% { background-position: center top; }
                50% { background-position: right top; }
                100% { background-position: center top; }
            }
            
            @media (max-width: 768px) {
                .card-modal-widget {
                    margin: 10%;
                }
                .ctn-jackpot-widget {
                    font-size: 1.5rem;
                    width: 50%;
                }
            }

            @media (min-width: 768px) {
                .card-modal-widget {
                    margin: 10% 20%;
                }
                .ctn-jackpot-widget {
                    font-size: 1.75rem;
                }
            }

            @media (max-width: 480px) {
                .card-modal-widget {
                    margin: 5%;
                }
                .ctn-jackpot-widget {
                    font-size: 1.2rem;
                    width: 50%;
                    text-wrap: nowrap;
                    overflow: hidden
                }
                .top-widget {
                    flex-direction: column;
                }
                .input-widget {
                    width: 100%;
                }
            }

             p,
            h2 {
                margin: 0px;
                padding: 0px;
                font-family: "Merienda", serif;
                font-optical-sizing: auto;
                font-weight: 700;
                font-style: normal;
            }

            .title-his-widget {
                width: 100%;
                padding: 10px;
                border-bottom: 1px solid rgb(233, 233, 233);
                background-color: rgb(237, 237, 237);
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            .closed-his {
                cursor: pointer;
            }

            .content-his-widget {
                text-align: center;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 10px;
            }

            .resault-content-widget {
                width: 80px;
                height: 80px;
                border-radius: 360px;
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 10px;
            }

            .resault-content-widget p {
                font-size: 35px;
                font-weight: bold;
                color: white;
            }

            .bet-his-widget {
                display: flex;
                flex: 1;
                width: 100%;

                flex-direction: row;
                gap: 10px;
            }

            .bet-box-his {
                padding: 5px;
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: center;
                gap: 5px;
                border-radius: 5px;
            }
            .bet-box-his > p {
                font-weight: 700;
                font-size: 16px
            }

            .box-49 {
                background-color:rgb(252, 244, 223);
            }

            .box-50 {
                background-color: #DCFCE7;
            }

            .total-content {
                flex-wrap: nowrap;
                display: flex;
                justify-content: space-between;
            }

            .footer-his-widget {
                display: flex;
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                padding: 10px;
            }
            .btn-action-his {
                background-color: transparent;
                outline: none;
                padding: 5px;
                border-radius: 5px;
                border: 1px solid gray;
                cursor: pointer;

            }
            .btn-action-his p {
                font-weight: 500;
            }

            .bg-49 {
                background-color: ${color.red}
            }

            .bg-50 {
                background-color: ${color.green}
            }

            .bet-list-his {
                margin-top: 20px;
                display: flex;
                flex-wrap: nowrap;
                overflow: scroll;
                flex-direction: row;
                gap: 10px;
                scrollbar-width: none;
                -ms-overflow-style: none;
                width: -webkit-fill-available;
            }

            :root {
                --primary: #F0B90B;
                --primary-dark: #D9A400;
                --secondary: #1E2026;
                --text: #1E2026;
                --text-secondary: #707A8A;
                --background: #FAFAFA;
                --card-bg: #FFFFFF;
                --border: #E6E8EA;
                --input-bg: #F5F5F5;
                --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .dark {
                --primary: #F0B90B;
                --primary-dark: #D9A400;
                --secondary: #1E2026;
                --text: #FFFFFF;
                --text-secondary: #B7BDC6;
                --background: #0B0E11;
                --card-bg: #1E2026;
                --border: #2A2D35;
                --input-bg: #2A2D35;
                --shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            body {
                background-color: var(--background);
                color: var(--text);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s, color 0.3s;
            }

                .theme-toggle {
                background: none;
                border: none;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--input-bg);
                color: var(--text);
                transition: background-color 0.3s;
            }

            .swap-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin: 10px 10px;
            }

            .input-container {
                background-color: var(--input-bg);
                border-radius: 12px;
                padding: 16px;
                transition: background-color 0.3s;
            }

            .input-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
            }

            .input-label {
                color: var(--text-secondary);
                font-size: 14px;
            }

            .balance {
                color: var(--text-secondary);
                font-size: 14px;
            }

            .input-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .amount-input {
                background: none;
                border: none;
                outline: none;
                font-size: 24px;
                font-weight: 500;
                color: var(--text);
                width: 70%;
                transition: color 0.3s;
            }

            .token-selector {
                display: flex;
                align-items: center;
                gap: 8px;
                background-color: var(--card-bg);
                padding: 8px 12px;
                border-radius: 8px;
                font-weight: 500;
                transition: background-color 0.3s;
            }

            .token-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: var(--primary);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .rate-container {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
                margin: 16px 0;
                transition: border-color 0.3s;
            }

            .rate-label {
                color: var(--text-secondary);
                font-size: 14px;
            }

            .rate-value {
                font-size: 14px;
                font-weight: 500;
            }

            .swap-button {
                background-color: var(--primary);
                color: var(--secondary);
                border: none;
                border-radius: 12px;
                padding: 16px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: background-color 0.3s;
            }

            .swap-button:hover {
                background-color: var(--primary-dark);
            }

            .info-container {
                margin-bottom: 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .info-row {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
            }

            .info-label {
                color: var(--text-secondary);
            }

            .info-value {
                font-weight: 500;
            }

            @media (max-width: 480px) {
                .container {
                    padding: 16px;
                }
                
                .amount-input {
                    font-size: 20px;
                }
            }

            .swap-btn-widget {
                background-color:rgb(255, 255, 255);
                 width: 35px;
                height: 35px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
                cursor: pointer;
            }

        `

        document.head.appendChild(style)
        document.head.appendChild(script)

        function createInitialElements() {
            const container = document.getElementById(containerId)
            container.style = ` scrollbar-width: none;  -ms-overflow-style: none;  animation: moveBackground 30s infinite linear; overflow-x: hidden; overflow-y: scroll; background-image: url('https://game-widget.vercel.app/images/decktop.jpg');height: 100%; width: 100%;`

            // Modal Noti
            const background_modal_noti = document.createElement('div')
            background_modal_noti.className = "bg-modal-widget none"
            background_modal_noti.id = "bg-modal-widget"
            const card_modal_noti = document.createElement('div')
            card_modal_noti.className = "card-modal-widget"
            const title_noti = document.createElement('p')
            title_noti.className = "tilte-modal-widget"

            card_modal_noti.appendChild(title_noti)
            background_modal_noti.appendChild(card_modal_noti)
            document.body.appendChild(background_modal_noti)

            // Modal Swap
            const background_swap = document.createElement('div')
            background_swap.className = "bg-modal-widget none"
            const card_swap = document.createElement('div')
            card_swap.className = "card-modal-widget"
            card_swap.innerHTML = `
                <div class="title-his-widget">
                    <p class="merienda-text-widget" style="font-size: x-large;">🔄 Swap ${gameData.symbol}</p>
                    <p class="closed-his" id="closed-swap">❌</p>
                </div>
                <div class="swap-container">
                    <div class="input-container">
                        <div class="input-header">
                            <span class="input-label">From</span>
                        </div>
                        <div class="input-content">
                            <input id="input-coin" value="0.0001" type="number" min="0.000001" max="1" class="amount-input" placeholder="0.0" />
                            <div class="token-selector">
                                <div class="token-icon">B</div>
                                <span>WBNB</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="input-container">
                        <div class="input-header">
                            <span class="input-label">To</span>
                        </div>
                        <div class="input-content">
                            <input id="input-token" type="number" class="amount-input" placeholder="0.0" readonly />
                            <div class="token-selector">
                                <div class="token-icon">G</div>
                                <span>${gameData.symbol}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rate-container">
                        <span class="rate-label">Exchange Rate</span>
                        <span class="rate-value">1 WBNB = 1.000.000 ${gameData.symbol}</span>
                    </div>
                    
                    <div class="info-container">
                        <div class="info-row">
                            <span class="info-label">Minimum received</span>
                            <span class="info-value">100 ${gameData.symbol}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Price Impact</span>
                            <span class="info-value">< 0.01%</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Network Fee</span>
                            <span class="info-value">~0.000125 WBNB</span>
                        </div>
                    </div>
                     <button id="swap_btn" class="swap-button">Xác nhận Swap</button>
                 </div>
            `
            background_swap.appendChild(card_swap)
            document.body.appendChild(background_swap)

            // Modal how to play
            const background_modal_info = document.createElement('div')
            background_modal_info.className = "bg-modal-widget none"
            background_modal_info.id = "bg-modal-widget"
            const card_modal_info = document.createElement('div')
            card_modal_info.className = "card-modal-widget"
            const title_info = document.createElement('p')
            title_info.className = "tilte-modal-widget"
            title_info.innerText = "How to play ?"
            const content_info = document.createElement('div')
            content_info.className = "content-modal-widget"
            content_info.innerHTML = `
                <p>Welcome to <span class="text-highlight-widget">BEF20 Jackpot Game</span>, an exciting blockchain-based betting game! Follow these steps to start playing and maximize your winnings.</p>
                
                <ul>
                    <h3>Game Requirements:</h3>
                    <li>To play, you need to connect your Metamask wallet. You will need BNB for transaction fees and the <strong>${gameData.symbol}</strong> specified by the game creator for in-game transactions.</li>
                </ul>

                <ul>
                    <h3>Over view</h3>
                    <li>Contarct Info: <a target="_blank" href="${getNetwork(gameData.chain_id).scan_url + "/address/" + gameData.contract_address}">Click here!</a></li>
                </ul>

                   
                <ul>
                    <h3>How to Play:</h3>
                    <li>After connecting your wallet, <span class="text-highlight-widget">select 1 to 10 numbers from 00 to 99.</span> 
                    Then, enter the amount of tokens you wish to bet. The bet will be equally distributed across the numbers you selected. Finally, click the "Play" button to place your bet.</li>
                </ul>

               <ul>
                    <h3>After Each Block is Confirmed:</h3>
                    <li>The game will use <span class="text-highlight-widget"> the last two digits of the block size </span> as the result.</li>
               </ul>
                <ul>
                    <li>If a player has correctly guessed the last two digits, their winnings will be distributed based on the proportion of their bet to the total pool.</li>
                    <li>If no one guesses correctly, the entire pool of funds will be carried over to the next round.</li>
                </ul>
                
                <p>Enjoy the game and good luck!</p>
            `
            card_modal_info.appendChild(title_info)
            card_modal_info.appendChild(content_info)
            background_modal_info.appendChild(card_modal_info)
            document.body.appendChild(background_modal_info)

            // Modal history
            const background_modal = document.createElement('div')
            background_modal.className = "bg-modal-widget none"
            background_modal.id = "bg-modal-widget"
            const card_modal = document.createElement('div')
            card_modal.className = "card-modal-widget"
            card_modal.innerHTML = `
                <div class="title-his-widget">
                    <p class="merienda-text-widget" style="font-size: x-large;">🧭 History</p>
                    <p class="closed-his" id="closed-his">❌</p>
                </div>
                <div class="content-his-widget">
                    <p class="merienda-text-widget">Block</p>
                    <h1 id="block-show-his" class="merienda-text-widget">#${current_block.height}</h1>
                    <div id="resault-content" class="resault-content-widget bg-49">
                        <p id="resault-show-his" class="merienda-text-widget">--</p>
                    </div>
                    <div class="bet-his-widget">
                        <div class="bet-box-his box-49">
                            <p>Total</p>
                            <p id="total-his">---</p>
                        </div>
                        <div class="bet-box-his box-50">
                            <p>Your Bet</p>
                            <p id="bet-his">---</p>
                        </div>
                    </div>
                    <p style="margin-top: 20px;">Your choice</p>
                    <div id="bet-list" class="bet-list-his">
                        Connect wallet to show !
                    </div>
                </div>
                <div class="footer-his-widget ">
                    <button class="btn-action-his btn-his-pre">
                        <p> ◀️ Previous </p>
                    </button>
                    <button class="btn-action-his btn-his-next">
                        <p> Next ▶️</p>
                    </button>
                </div>
            `
            background_modal.appendChild(card_modal)
            document.body.appendChild(background_modal)

            // Connect wallet button
            const walletButton = document.createElement("div");
            walletButton.className = "btn-wallet-widget ";
            const walletIcon = document.createElement("img");
            walletIcon.className = "icon-widget";
            walletIcon.src = "https://game-widget.vercel.app/images/metamask.png";
            const walletText = document.createElement("p");
            walletText.className = "btn-wallet-text-widget merienda-text-widget";
            walletText.textContent = "Connect wallet";
            walletButton.appendChild(walletIcon);
            walletButton.appendChild(walletText);
            container.appendChild(walletButton);

            // Create Buutton history, button info
            const action_div = document.createElement('div')
            action_div.className = "action-div-widget "
            action_div.id = "current-block"
            action_div.textContent = "#" + betBlock(current_block.height)
            const history_btn = document.createElement('div')
            history_btn.className = "action-btn-widget history-btn-widget"
            const his_icon = document.createElement('img')
            his_icon.className = "his-icon-widget"
            his_icon.src = "https://game-widget.vercel.app/images/history.png"
            const info_btn = document.createElement('div')
            info_btn.className = "action-btn-widget info-btn-widget"
            info_btn.textContent = '?'
            const gropu_btn = document.createElement('div')
            gropu_btn.style = `display:flex; flex-direction:row; align-items:center;gap:10px;`
            history_btn.appendChild(his_icon)
            const swap_btn = document.createElement('div')
            swap_btn.className = " swap-btn-widget"
            swap_btn.innerText = `🔄`
            // gropu_btn.appendChild(swap_btn)
            gropu_btn.appendChild(history_btn)
            gropu_btn.appendChild(info_btn)
            action_div.appendChild(gropu_btn)
            container.appendChild(action_div)

            // Pig Image
            const ctn_pig = document.createElement('div')
            ctn_pig.className = "ctn-pig-widget"
            ctn_pig.innerHTML = `
                <dotlottie-player src="https://lottie.host/d0e9200a-390f-4ddc-bc4a-cc834aae42af/ZIbJe8tm8f.lottie"
                background="transparent" speed="1" style="width: 200px; height: 200px" loop autoplay></dotlottie-player>
                <p id="count_bet" class="ctn-jackpot-widget">${renderTotal(total_bet)}</p>
            `
            container.appendChild(ctn_pig)

            // Number select
            const ctn_num_select = document.createElement('div')
            ctn_num_select.className = "num-ctn-widget"
            const ct_num_select = document.createElement('div')
            ct_num_select.className = "num-ct-widget"
            ct_num_select
            NumberBtn.forEach((item) => {
                const btn_num = document.createElement('button')
                btn_num.className = "btn_num_bet"
                btn_num.innerText = item.number
                btn_num.id = item.number
                const background = item.status ? `background-image: linear-gradient(${color.top_neon}, ${color.bot_neon})` :
                    `background-color: ${color.btn_dis}`
                btn_num.style = renderUi(background)
                btn_num.addEventListener('click', (e) => {
                    const index = NumberBtn.findIndex(item => item.number == e.target.textContent)
                    NumberBtn[index].status = !NumberBtn[index].status
                    const btn = document.getElementById(e.target.textContent)
                    btn.style = renderUi(NumberBtn[index].status ? `background-image: linear-gradient(${color.top_neon}, ${color.bot_neon})` :
                        `background-color: ${color.btn_dis}`)

                    mathToken(NumberBtn)
                })
                ct_num_select.appendChild(btn_num)
            })
            ctn_num_select.appendChild(ct_num_select)
            container.appendChild(ctn_num_select)

            // Group action
            const card_ctn_bet = document.createElement('div')
            card_ctn_bet.className = "card-ctn-bet"

            const const_ct_bet = document.createElement('div')
            const_ct_bet.className = "card-ct-bet"

            const top = document.createElement('div')
            top.className = "top-widget"
            const ctn_input = document.createElement('div')
            ctn_input.style = `
                flex: 1;align-items: center; border-radius: 5px; display: flex;flex-direction: row;gap: 10px;padding: 10px;background-color: #151F3B;
            `
            const img = document.createElement('img')
            img.src = Image(gameData.contract_icon)
            img.style = `
                width: 30px;
                height: 30px;
            `
            const input = document.createElement('input')
            input.className = 'input-widget'
            input.id = 'input-widget'
            input.onchange = function () {
                mathToken(NumberBtn)
            };
            input.placeholder = "Enter tokens per number"
            input.type = 'number'
            input.value = "5"
            input.style = `font-family: "Merienda", serif; font-weight: 700;outline:none; background-color: transparent; border: none; color:white; font-size: 1.25rem;`
            ctn_input.appendChild(img)
            ctn_input.appendChild(input)
            top.appendChild(ctn_input)
            card_ctn_bet.appendChild(top)
            const btn_bet = document.createElement('button')
            btn_bet.id = "play-widget"
            btn_bet.style = `cursor: pointer; border-radius: 5px; color: white; padding: 0px 20px;border: 0px; font-size: 18px; font-family: "Merienda", serif; font-weight: 700;outline:none; height: 50px;background-image: linear-gradient(${color.top_neon}, ${color.bot_neon})`
            btn_bet.textContent = "Play"
            top.appendChild(btn_bet)
            const_ct_bet.appendChild(top)
            const act_div = document.createElement('div')
            act_div.style = `display: flex; padding: 0% 5%; flex:1; justify-content: center;`
            const ctn_btn_action = document.createElement('div')
            ctn_btn_action.className = "group-actbtn-widget "
            const auto_selct = document.createElement('button')
            auto_selct.className = "btn-bet-widget auto-select-widget"
            auto_selct.textContent = "AUTOSELECT"
            const remove = document.createElement('button')
            remove.className = "btn-bet-widget remove-widget "
            remove.textContent = "CLEAR"
            ctn_btn_action.appendChild(auto_selct)
            ctn_btn_action.appendChild(remove)
            card_ctn_bet.appendChild(const_ct_bet)
            act_div.appendChild(ctn_btn_action)
            container.appendChild(act_div)
            container.appendChild(card_ctn_bet)

            const jackpot = document.createElement('audio')
            jackpot.src = 'https://gamebo-widget.vercel.app/sounds/jackpot.mp3'
            jackpot.type = "audio/mp3"
            const add_coin = document.createElement('audio')
            add_coin.src = 'https://gamebo-widget.vercel.app/sounds/add_coin.mp3'
            add_coin.type = "audio/mp3"
            const error = document.createElement('audio')
            error.src = 'https://gamebo-widget.vercel.app/sounds/error.mp3'
            error.type = "audio/mp3"

            container.appendChild(jackpot)
            container.appendChild(add_coin)
            container.appendChild(error)
            // Inner Function 
            async function TransferToken(value) {
                try {
                    const abi = ["function transfer(address to, uint256 value) public returns (bool)", "function decimals() view returns (uint256)"];
                    const tokenContract = new ethers.Contract(gameData.contract_address, abi, singer_wallet);
                    const recipient = gameData.master_wallet_address;
                    const decimals = await tokenContract.decimals();
                    const amount = ethers.utils.parseUnits(value, decimals);
                    const tx = await tokenContract.transfer(recipient, amount);
                    const data = await tx.wait()
                    return { status: true, data }
                } catch (error) {
                    if (error.toString().includes('estimate gas')) {
                        showNoti("🔴 Insufficient balance")
                    }
                    if (error.toString().includes('user rejected')) {
                        showNoti("🔴 Transaction canceled")
                    }
                    return { status: false, data: error }
                }
            }

            function showNoti(noti, type = false) {
                background_swap.className = "bg-modal-widget none"
                title_noti.innerText = noti
                background_modal_noti.className = "bg-modal-widget block"
                if (!type) {
                    error.play()
                }

            }

            // Btn action
            const btnwallet = document.querySelector('.btn-wallet-widget');
            const btnwallet_text = document.querySelector('.btn-wallet-text-widget');
            const closed_his = document.getElementById('closed-his')
            const his_Prev = card_modal.querySelector('.btn-his-pre');
            const his_Next = card_modal.querySelector('.btn-his-next');
            const closed_swap = document.getElementById('closed-swap')
            const input_coin = document.getElementById('input-coin')
            const swap = document.getElementById('swap_btn')

            function reRenderHis(index) {
                const item = histories[index]
                if (item) {
                    const resault_content = document.getElementById('resault-content')
                    resault_content.className = item.total_num_win > 0 ? "resault-content-widget bg-50" : "resault-content-widget bg-49"
                    const block_show_his = document.getElementById('block-show-his')
                    block_show_his.innerText = "#" + item.block_height
                    const resault_show_his = document.getElementById('resault-show-his')
                    resault_show_his.innerText = item.result

                    const total_his = document.getElementById('total-his')
                    const bet_his = document.getElementById('bet-his')
                    total_his.innerText = Number(item.total).toLocaleString('vi-VN', 'utf8')
                    bet_his.innerText = Number(item.bet).toLocaleString('vi-VN', 'utf8')

                    if (currentWallet) {
                        const bet_list = document.getElementById('bet-list')
                        bet_list.innerHTML = ""
                        if (item.numbers.length != 0) {
                            item.numbers.map((ob => {
                                const bet_value = document.createElement('div')
                                bet_value.style = `font-size: 14px; padding: 5px 10px; border-radius: 5px; background-color: ${ob.number == item.result ? color.green : 'rgb(222, 222, 222)'};`;
                                bet_value.innerHTML = `
                                <p>${ob.number}</p>
                                <p style="text-wrap: nowrap;">${Number(ob.amount).toLocaleString('vi-VN', 'utf8')}<span>🪙</span></p>
                            `
                                bet_list.appendChild(bet_value)

                            }))
                        }

                    }
                    hisIndex = index
                }
            }

            async function swapToken(amountInBNB, tokenOut, coinIn = "0xae13d989dac2f0debff460ac112a837c89baa7cd") {
                try {
                    // Kiểm tra xem trình duyệt có hỗ trợ Ethereum không (MetaMask hoặc ví tương tự)
                    if (!window.ethereum) {
                        showNoti("🔴 Please install MetaMask or another Ethereum-compatible wallet!");
                        return;
                    }

                    // Tạo provider từ window.ethereum
                    const provider = new ethers.providers.Web3Provider(window.ethereum);

                    // Yêu cầu người dùng kết nối ví
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const userAddress = await signer.getAddress(); // Lấy địa chỉ ví của người dùng

                    const PANCAKESWAP_ROUTER = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
                    const WBNB = coinIn;

                    // Tạo contract instance với signer
                    const router = new ethers.Contract(
                        PANCAKESWAP_ROUTER,
                        [
                            "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)",
                            "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
                        ],
                        signer
                    );

                    // Kiểm tra số dư BNB của ví người dùng
                    const balance = await provider.getBalance(userAddress);
                    if (balance.lt(ethers.utils.parseEther(amountInBNB))) {
                        showNoti("🔴 Insufficient tBNB balance");
                        return;
                    }

                    const amountInWei = ethers.utils.parseEther(amountInBNB);
                    const path = [WBNB, tokenOut];
                    const to = userAddress;
                    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

                    // Kiểm tra lượng token dự kiến nhận được
                    const amounts = await router.getAmountsOut(amountInWei, path);
                    const amountOutMin = amounts[1].mul(95).div(100);

                    // Thực hiện giao dịch swap
                    const tx = await router.swapExactETHForTokens(
                        amountOutMin,
                        path,
                        to,
                        deadline,
                        {
                            value: amountInWei,
                            gasLimit: ethers.BigNumber.from("500000")
                        }
                    );
                    const receipt = await tx.wait();
                    console.log(receipt);

                    if (receipt) {

                    }
                } catch (error) {
                    if (error.toString().includes('estimate gas')) {
                        showNoti("🔴 Insufficient balance")
                    }
                    if (error.toString().includes('user rejected')) {
                        showNoti("🔴 Transaction canceled")
                    }
                }
            }


            btnwallet.addEventListener('click', async () => {
                const provider = typeof window.ethereum !== "undefined"
                    ? new ethers.providers.Web3Provider(window.ethereum)
                    : null;

                function isMobileDevice() {
                    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                }

                if (isMobileDevice()) {
                    try {
                        const WalletConnectProvider = window.WalletConnectProvider;
                        const walletProvider = new WalletConnectProvider({
                            bridge: "https://bridge.walletconnect.org",
                        });

                        await walletProvider.enable();
                        const web3Provider = new ethers.providers.Web3Provider(walletProvider);
                        const signer = web3Provider.getSigner();
                        const address = await signer.getAddress();
                        btnwallet_text.innerText = `✅ ${address.slice(0, 6)}...${address.slice(-4)}`;
                        btnwallet.disabled = true;
                    } catch (err) {
                        showNoti("🔴 Cannot connect Wallet on Phone")
                        console.error("Lỗi kết nối WalletConnect:", err);
                    }
                } else {
                    // PC
                    if (provider) {
                        try {
                            await window.ethereum.request({ method: "eth_requestAccounts" });
                            singer_wallet = provider.getSigner();
                            const address = await singer_wallet.getAddress();
                            btnwallet_text.innerText = `${address.slice(0, 6)}...${address.slice(-4)}`;
                            btnwallet.disabled = true;
                            currentWallet = address;
                            historyData(hisData)
                        } catch (err) {
                            showNoti("🔴 Connect Wallet failed ")
                        }
                    } else {
                        showNoti("⚠️ Install Metamask to continute");
                        const button = document.createElement("button");
                        button.innerText = "🦊 Install now";
                        button.style.cssText = `
                        width: 90%; 
                        margin-top:200px;
                        padding:10px 15px;
                        font-size:16px;
                        background:#f6851b;
                        color:white;
                        border:none;
                        border-radius:5px;
                        cursor:pointer;`;
                        document.body.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #090a0c;
                    `

                        button.addEventListener("click", () => {
                            window.location.replace("https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn")
                        })
                        document.body.innerHTML = ''
                        document.body.appendChild(button);
                    }

                }

            });
            closed_his.addEventListener('click', () => {
                background_modal.className = "bg-modal-widget none"
            })
            closed_swap.addEventListener('click', () => {
                background_swap.className = "bg-modal-widget none"
            })
            his_Prev.addEventListener('click', function () {
                reRenderHis(hisIndex - 1)
            });

            his_Next.addEventListener('click', function () {
                reRenderHis(hisIndex + 1)
            });

            history_btn.addEventListener('click', () => {
                background_modal.className = "bg-modal-widget block"
            })
            background_modal_info.addEventListener('click', () => {
                background_modal_info.className = "bg-modal-widget none"
            })
            info_btn.addEventListener('click', () => {
                background_modal_info.className = "bg-modal-widget block"
            })
            background_modal_noti.addEventListener('click', () => {
                background_modal_noti.className = "bg-modal-widget none"
            })
            swap_btn.addEventListener('click', () => {
                background_swap.className = "bg-modal-widget block"
            })

            swap.addEventListener('click', () => {
                swapToken(input_coin.value, gameData.contract_address)

            })

            input_coin.addEventListener('input', (e) => {
                const swap_value = document.getElementById('input-token')
                swap_value.value = (e.target.value) * 1000000
            })
            btn_bet.addEventListener('click', async () => {
                const numbers = NumberBtn.filter(item => item.status).map(item => item.number)
                const value = Number(input.value);

                const checkValue = () => {
                    if (value > Number(gameData.max_bet_amount)) {
                        showNoti(`🟡 Max bet amount is ${gameData.max_bet_amount}`)
                        return false
                    }
                    if (value < Number(gameData.min_bet_amount)) {
                        showNoti(`🟡 Min bet amount is ${gameData.min_bet_amount}`)
                        return false
                    }
                    return true
                }
                if (!checkValue()) {
                    return;
                }

                if (!currentWallet) {
                    showNoti(`🟡 Connect Metamask wallet to play!!`)
                    return;
                }
                if (!value) {
                    showNoti(`🟡 Please enter token to bet!!`)
                    return;
                }
                if (numbers.length <= 0) {
                    showNoti(`🟡 Please choose numbers !!`)
                    return;
                }
                const input_value = (Number(value) * numbers.length).toString()
                const tx = await TransferToken(input_value)
                if (tx.status) {
                    const body = (num) => {

                        return {
                            "game_id": gameData.id,
                            "wallet_address": currentWallet,
                            "block_height": betBlock(current_block.height).toString(),
                            "choice": num,
                            "bet_amount": value.toString(),
                            "bet_tx_hash": tx.data.transactionHash,
                        }
                    }
                    const promise = await Promise.all(
                        numbers.map(item => {
                            fetch(`${urlAction.bet}`, {
                                method: "POST",
                                body: JSON.stringify(body(item))
                            })
                        })
                    ).then(() => true).catch(() => false)
                    if (promise) {
                        showNoti(`🟢 You bet ${NumberBtn.filter((item) => item.status).length * value} ${gameData.symbol} for ${numbers.join(", ")}`, true)
                        add_coin.play()
                    } else {
                        showNoti('🔴 Bet failed! Connect to supported !')
                    }
                }
            })
            auto_selct.addEventListener('click', () => {
                const index = Math.floor(Math.random() * 99)
                NumberBtn[index].status = true
                const numbers = document.querySelectorAll('.btn_num_bet')
                numbers.forEach((el, index) => {
                    el.style = renderUi(NumberBtn[index].status ? `background-image: linear-gradient(${color.top_neon}, ${color.bot_neon})` :
                        `background-color: ${color.btn_dis}`)
                })
                mathToken(NumberBtn)
            })
            remove.addEventListener('click', () => {
                NumberBtn = Array(100).fill().map((_, i) => ({ number: (`0${i}`).slice(-2), status: false }));
                const numbers = document.querySelectorAll('.btn_num_bet')
                numbers.forEach((el) => {
                    el.style = renderUi(`background-color: ${color.btn_dis}`)
                })
                mathToken(NumberBtn)
            })

        }

        createInitialElements()
    }

    function renderUi(background) {
        return `width:  40px;
        height: 40px;
        outline: none;
        color: white;
        outline: none;
        border-radius: 360px;
        padding: 10px;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        ${background}`
    }

    function changeFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
            link.href = url;

            document.title = gameData.name
        }
    }

    // Start 
    import_js()
    data_game().then((data) => {
        gameData = data
        changeFavicon(Image(gameData.contract_icon))
        getBlock().then(() => {
            connectBlockChain()
            connectGamedata()
            GenarateUI()
        })

    })

    window.addEventListener('unload', () => {
        Ssocket.close()
    })
})();
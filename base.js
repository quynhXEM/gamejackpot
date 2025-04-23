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
            "symbol": "ETH",
            "native_currency": "Ether",
            "chain_id": 1,
            "api_explorer": "https://api.etherscan.io/v2/api",
            "api_url": "https://mainnet.infura.io/v3",
            "scan_url": "https://etherscan.io",
            "rpc_url": "https://rpc.builder0x69.io"
        },
        {
            "name": "Binance Smart Chain",
            "symbol": "BNB",
            "native_currency": "BNB",
            "chain_id": 56,
            "api_url": "https://bsc-testnet.infura.io/v3",
            "api_explorer": "https://api.bscscan.com/api",
            "scan_url": "https://bscscan.com",
            "rpc_url": "https://bsc-dataseed.binance.org"
        },
        {
            "name": "Polygon",
            "symbol": "MATIC",
            "native_currency": "MATIC",
            "chain_id": 137,
            "api_explorer": "https://api.polygonscan.com/api",
            "api_url": "https://polygon-mainnet.infura.io/v3",
            "scan_url": "https://polygonscan.com",
            "rpc_url": "https://polygon-rpc.com"
        },
        {
            "name": "Avalanche (Coming Soon)",
            "symbol": "AVAX",
            "native_currency": "AVAX",
            "chain_id": 43114,
            "api_explorer": "https://snowtrace.io",
            "api_url": "https://avalanche-mainnet.infura.io/v3",
            "scan_url": "https://snowtrace.io",
            "rpc_url": "https://api.avax.network/ext/bc/C/rpc"
        },
        {
            "name": "Arbitrum One",
            "symbol": "ETH",
            "native_currency": "Ether",
            "chain_id": 42161,
            "api_explorer": "https://api.arbiscan.io/api",
            "api_url": "https://arbitrum-mainnet.infura.io/v3",
            "scan_url": "https://arbiscan.io",
            "rpc_url": "https://arb1.arbitrum.io/rpc"
        },
        {
            "name": "Optimism Ethescan",
            "symbol": "ETH",
            "native_currency": "Ether",
            "chain_id": 10,
            "api_explorer": "https://api-optimistic.etherscan.io/api",
            "api_url": "https://optimism-mainnet.infura.io/v3",
            "scan_url": "https://optimistic.etherscan.io",
            "rpc_url": "https://mainnet.optimism.io"
        },
        {
            "name": "Celo",
            "symbol": "CELO",
            "native_currency": "CELO",
            "chain_id": 42220,
            "api_explorer": "https://api.celoscan.io/api",
            "api_url": "https://celo-mainnet.infura.io/v3",
            "scan_url": "https://celoscan.io",
            "rpc_url": "https://forno.celo.org"
        },
        {
            "name": "Ethereum Sepolia Testnet",
            "symbol": "ETH",
            "native_currency": "SepoliaETH",
            "chain_id": 11155111,
            "api_explorer": "https://api-sepolia.etherscan.io/api",
            "api_url": "https://sepolia.infura.io/v3",
            "scan_url": "https://sepolia.etherscan.io",
            "rpc_url": "https://rpc.sepolia.org"
        },
        {
            "name": "Binance Smart Chain Testnet",
            "symbol": "tBNB",
            "native_currency": "Testnet BNB",
            "chain_id": 97,
            "api_explorer": "https://api-testnet.bscscan.com/api",
            "api_url": "https://bsc-testnet.infura.io/v3",
            "scan_url": "https://testnet.bscscan.com",
            "rpc_url": "https://data-seed-prebsc-1-s1.binance.org:8545"
        },
        {
            "name": "Avalanche Fuji Testnet (Coming Soon)",
            "symbol": "AVAX",
            "native_currency": "Testnet AVAX",
            "chain_id": 43113,
            "api_explorer": "https://testnet.snowtrace.io",
            "api_url": "https://avalanche-fuji.infura.io/v3",
            "scan_url": "https://testnet.snowtrace.io",
            "rpc_url": "https://api.avax-test.network/ext/bc/C/rpc"
        },
        {
            "name": "Fantom",
            "symbol": "FTM",
            "native_currency": "FTM",
            "chain_id": 250,
            "api_explorer": "https://api.ftmscan.com/api",
            "api_url": "https://rpc.ftm.tools",
            "scan_url": "https://ftmscan.com",
            "rpc_url": "https://rpcapi.fantom.network"
        },
        {
            "name": "Cronos",
            "symbol": "CRO",
            "native_currency": "CRO",
            "chain_id": 25,
            "api_explorer": "https://api.cronoscan.com/api",
            "api_url": "https://evm.cronos.org",
            "scan_url": "https://cronoscan.com",
            "rpc_url": "https://evm.cronos.org"
        },
        {
            "name": "Moonbeam",
            "symbol": "GLMR",
            "native_currency": "GLMR",
            "chain_id": 1284,
            "api_explorer": "https://api-moonbeam.moonscan.io/api",
            "api_url": "https://1rpc.io/glmr",
            "scan_url": "https://moonscan.io",
            "rpc_url": "https://rpc.api.moonbeam.network"
        },
        {
            "name": "Moonbase Alpha Testnet",
            "symbol": "DEV",
            "native_currency": "DEV",
            "chain_id": 1287,
            "api_explorer": "https://api-moonbase.moonscan.io/api",
            "api_url": "https://rpc.testnet.moonbeam.network",
            "scan_url": "https://moonbase.moonscan.io",
            "rpc_url": "https://rpc.api.moonbase.moonbeam.network"
        },
        {
            "name": "Bitcoin",
            "symbol": "BTC",
            "native_currency": "Bitcoin",
            "chain_id": 0,
            "api_explorer": "https://blockchain.info",
            "api_url": "https://api.blockcypher.com",
            "scan_url": "https://btcscan.org",
            "rpc_url": "https://bitcoin.drpc.org"
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
    let new_bet = [];
    // Hàm xử lý 
    function Image(id) {
        return `https://soc.bitrefund.co/assets/${id}`
    }

    function betBlock(current) {
        return Number(current) + 1
    }

    async function data_game() {
        const data = await fetch(`https://get-game.nguyenxuanquynh1812nc1.workers.dev/${slug}?type=jackpot`, {
            method: "GET"
        })
            .then((data) => data.json())
            .then((data) => {
                return data.data?.[0]
            })
            .catch((err) => {
                return null
            })


        const providerUrl = getNetwork(data.chain_id).rpc_url

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
        return "JACKPOT: " + new Intl.NumberFormat('de-DE').format(total_bet) + " " + gameData.symbol
    }

    function renderNewBet() {
        const marqueeText = document.getElementById('new_bet');
        marqueeText.style = "text-wrap: nowrap;";
        const list_bet = [];
        new_bet.forEach(item => {
            if (list_bet[item.choice] == undefined) {
                list_bet[item.choice] = {
                    choice: item.choice,
                    bet_amount: 0
                }
            } 
            list_bet[item.choice].bet_amount += Number(item.bet_amount)
        })
        console.log(Object.entries(list_bet));
        
        const text = Object.entries(list_bet).map(([_, value]) => value).map(item => item)?.map(item => " 🟢 Số " + item.choice + ": " + item.bet_amount + gameData.symbol + "       ")?.join(" - ")
        marqueeText.textContent = text;

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
                                    ],
                                    sort: ['-date_created'],
                                    limit: 100000
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
                            new_bet = data.filter(item => item.block_height == betBlock(current_block.height) && item.choice != -1)
                            renderNewBet()
                            break;
                        case 'create':
                            total_bet += data.filter(item => item.block_height == betBlock(current_block.height))
                                .reduce((total, item) => total + (Number(item.bet_amount) || 0), 0)
                            count_bet.textContent = renderTotal(total_bet)
                            new_bet.push(...data)
                            renderNewBet()
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
    function historyData(bets) {
        const groupedByBlock = {};

        // Gom nhóm theo block
        for (const bet of bets) {
            const block = bet.block_height;
            if (!groupedByBlock[block]) {
                groupedByBlock[block] = [];
            }
            groupedByBlock[block].push(bet);
        }

        // Xử lý từng block
        const result = Object.entries(groupedByBlock)
            .sort((a, b) => Number(b[0]) - Number(a[0])) // Sắp xếp giảm dần theo block
            .map(([block, bets]) => {
                const totalBets = bets.reduce((sum, b) => b.choice != -1 ? sum + parseFloat(b.bet_amount || 0) : sum, 0);
                const totalWins = bets.reduce((sum, b) => sum + parseFloat(b.winning_amount || 0), 0);
                const pot = bets.find(item => item.choice == -1)?.bet_amount || 0
                const wins = bets.filter(b => b.status === "win").length;
                const winRate = bets.length > 0 ? wins / bets.length : 0;

                const resultValue = bets[0]?.result || null;

                // Mô tả theo choice cho ví được lọc
                const walletChoices = bets.filter(b => b.wallet_address === currentWallet);
                const choiceMap = {};
                for (const b of walletChoices) {
                    const choice = b.choice;
                    if (!choiceMap[choice]) {
                        choiceMap[choice] = { amount: 0, win_amount: 0 };
                    }
                    choiceMap[choice].amount += parseFloat(b.bet_amount || 0);
                    choiceMap[choice].win_amount += parseFloat(b.winning_amount || 0);
                }

                const description = Object.entries(choiceMap).map(([number, data]) => ({
                    number,
                    amount: data.amount,
                    win_amount: data.win_amount
                }));

                // Ví thắng cược
                const walletsWin = bets
                    .filter(b => b.status === "win" && b.wallet_address !== gameData.master_wallet_address)
                    .map(b => ({
                        wallet: b.wallet_address,
                        bet_amount: parseFloat(b.bet_amount || 0),
                        win_amount: parseFloat(b.winning_amount || 0),
                        choice: b.choice
                    }));

                const countChoices = {};
                for (const b of bets) {
                    if (b.choice != -1) {
                        const c = b.choice;
                        countChoices[c] = (countChoices[c] || 0) + 1;
                    }

                }

                const maxCount = Math.max(...Object.values(countChoices))
                const numbers = Object.entries(countChoices)
                    .filter(([_, count]) => count === maxCount)
                    .map(([choice]) => choice)
                    .slice(0, 5)


                return {
                    block,
                    win_rate: winRate,
                    total_bet: totalBets,
                    pot,
                    win_amount: totalWins,
                    result: resultValue,
                    description,
                    numbers,
                    wallets_win: walletsWin
                };
            });

        histories = result
        return result;
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

            .new_bet {
            color: white; font-family: "Merienda", serif; font-weight: 700; font-size: 1rem; text-align: center; padding: 10px; border-radius: 5px;
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
                padding: 5px;
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
                color: ${color.red};
                font-family: "Merienda", serif;
                font-weight: 700;
                margin: 0px;
                border: 2px solid #00CCFE;
                text-wrap: none;
                transaction: 
            }

            .new-bet-widget {
                width: 100%;
                background-color: rgba(37, 51, 119, 0.5);
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
                    margin: 5% 20%;
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
            // const background_swap = document.createElement('div')
            // background_swap.className = "bg-modal-widget none"
            // const card_swap = document.createElement('div')
            // card_swap.className = "card-modal-widget"
            // card_swap.innerHTML = `
            //     <div class="title-his-widget">
            //         <p class="merienda-text-widget" style="font-size: x-large;">🔄 Swap ${gameData.symbol}</p>
            //         <p class="closed-his" id="closed-swap">❌</p>
            //     </div>
            //     <div class="swap-container">
            //         <div class="input-container">
            //             <div class="input-header">
            //                 <span class="input-label">From</span>
            //             </div>
            //             <div class="input-content">
            //                 <input id="input-coin" value="0.0001" type="number" min="0.000001" max="1" class="amount-input" placeholder="0.0" />
            //                 <div class="token-selector">
            //                     <div class="token-icon">B</div>
            //                     <span>WBNB</span>
            //                 </div>
            //             </div>
            //         </div>

            //         <div class="input-container">
            //             <div class="input-header">
            //                 <span class="input-label">To</span>
            //             </div>
            //             <div class="input-content">
            //                 <input id="input-token" type="number" class="amount-input" placeholder="0.0" readonly />
            //                 <div class="token-selector">
            //                     <div class="token-icon">G</div>
            //                     <span>${gameData.symbol}</span>
            //                 </div>
            //             </div>
            //         </div>

            //         <div class="rate-container">
            //             <span class="rate-label">Exchange Rate</span>
            //             <span class="rate-value">1 WBNB = 1.000.000 ${gameData.symbol}</span>
            //         </div>

            //         <div class="info-container">
            //             <div class="info-row">
            //                 <span class="info-label">Minimum received</span>
            //                 <span class="info-value">100 ${gameData.symbol}</span>
            //             </div>
            //             <div class="info-row">
            //                 <span class="info-label">Price Impact</span>
            //                 <span class="info-value">< 0.01%</span>
            //             </div>
            //             <div class="info-row">
            //                 <span class="info-label">Network Fee</span>
            //                 <span class="info-value">~0.000125 WBNB</span>
            //             </div>
            //         </div>
            //          <button id="swap_btn" class="swap-button">Xác nhận Swap</button>
            //      </div>
            // `
            // background_swap.appendChild(card_swap)
            // document.body.appendChild(background_swap)

            // Modal how to play
            const background_modal_info = document.createElement('div')
            background_modal_info.className = "bg-modal-widget none"
            background_modal_info.id = "bg-modal-widget"
            const card_modal_info = document.createElement('div')
            card_modal_info.className = "card-modal-widget"
            const title_info = document.createElement('p')
            title_info.className = "tilte-modal-widget"
            title_info.innerText = "Thông tin && Hướng dẫn"
            const content_info = document.createElement('div')
            content_info.className = "content-modal-widget"
            content_info.innerHTML = `
                <p>Chào mừng bạn đến với <span class="text-highlight-widget">BEF20 Jackpot Game</span> — một trò chơi cá cược dựa trên blockchain đầy kịch tính! Hãy làm theo các bước sau để bắt đầu chơi và tối đa hóa cơ hội chiến thắng của bạn.</p>

                <ul>
                    <h3>Yêu cầu để chơi:</h3>
                    <li>Để tham gia, bạn cần kết nối ví Metamask. Bạn sẽ cần BNB để trả phí giao dịch và <strong>${gameData.symbol}</strong> (do người tạo trò chơi quy định) để thực hiện các giao dịch trong game.</li>
                </ul>

                <ul>
                    <h3>Tổng quan</h3>
                    <li>Thông tin hợp đồng: <a target="_blank" href="${getNetwork(gameData.chain_id).scan_url + "/token/" + gameData.contract_address}">Bấm vào đây!</a></li>
                    <li>Thông tin khối hiện tại: <a target="_blank" href="https://www.blockchain.com/explorer/blocks/btc/${current_block.height}">Bấm vào đây!</a></li>
                </ul>

                <ul>
                    <h3>Quy tắc cược</h3>
                    <li>Cược tối thiểu: ${Number(gameData?.min_bet_amount).toFixed(2)} ${gameData.symbol}</li>
                    <li>Cược tối đa: ${Number(gameData?.max_bet_amount).toFixed(2)} ${gameData.symbol}</li>
                    <li>Bước cược: ${Number(gameData?.bet_step_amount).toFixed(2)} ${gameData.symbol}</li>
                </ul>

                <ul>
                    <h3>Hướng dẫn chơi:</h3>
                    <li>Sau khi kết nối ví, <span class="text-highlight-widget">hãy chọn từ 1 đến 10 con số trong khoảng từ 00 đến 99.</span> Sau đó, nhập số lượng token bạn muốn cược. Số tiền cược sẽ được chia đều cho các số bạn đã chọn. Cuối cùng, nhấn nút "Chơi" để đặt cược.</li>
                </ul>

                <ul>
                    <h3>Sau mỗi khối được xác nhận:</h3>
                    <li>Trò chơi sẽ sử dụng <span class="text-highlight-widget">hai chữ số cuối của kích thước khối</span> để làm kết quả.</li>
                </ul>

                <ul>
                    <li>Nếu người chơi đoán đúng hai chữ số cuối, phần thưởng sẽ được phân phối dựa trên tỷ lệ cược của họ so với tổng số cược.</li>
                    <li>Nếu không ai đoán đúng, toàn bộ số tiền trong pool sẽ được chuyển sang vòng tiếp theo.</li>
                </ul>

                <p>Chúc bạn chơi vui vẻ và may mắn!</p>

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
                <div class="popup-header" style="display: flex; width: 100%; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div class="header-left" style="display: flex; align-items: center; gap: 10px;">
                    <div class="history-icon" style="background-color: #FFC107; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-history"></i>
                    </div>
                    <h2 style="font-size: 22px; font-weight: 600; color: #333; margin: 0;">Lịch sử </h2>
                </div>
                <p class="closed-his" id="closed-his">❌</p>
                </div>

                <div class="block-info" style="text-align: center; margin-bottom: 15px;">
                <p style="font-size: 16px; color: #666; margin-bottom: 5px;">Block</p>
                <h1 id="block-view" style="font-size: 28px; font-weight: 700; color: #333; margin-bottom: 5px;">${current_block.height}</h1>
                <a id="block-detail-view" href="https://www.blockchain.com/explorer/blocks/btc/${current_block.height} class="blockchain-link" target="_blank" style="display: inline-block; color: #3498db; text-decoration: none; font-size: 14px; margin-top: 5px;">
                    Xem thông tin <i class="fas fa-external-link-alt"></i>
                </a>
                </div>

                <div id="result-container" class="result-circle" style="width: 80px; height: 80px; background-color:rgb(180, 180, 180); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 20px auto; color: white; font-size: 24px; font-weight: bold;">
                <span id="result-view">--</span>
                </div>

                <div class="stats-summary" style="display: flex; width: 100%; justify-content: space-between; margin: 20px 0; background-color: #f8f9fa; border-radius: 10px; padding: 15px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 12px; color: #666; margin-bottom: 5px;">Tỉ Lệ Thắng</span>
                    <span id="win-rate-view" style="font-size: 16px; font-weight: 600; color: #333;">---</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 12px; color: #666; margin-bottom: 5px;">Tổng Cược</span>
                    <span id="total-bet-view" style="font-size: 16px; font-weight: 600; color: #333;">---</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 12px; color: #666; margin-bottom: 5px;">Tổng Hũ</span>
                    <span id="win-amount-view" style="font-size: 16px; font-weight: 600; color: #333;">---</span>
                </div>
                </div>

                <div class="teams-container" style="display: flex; flex: 1; width: 100%; gap: 10px; margin-bottom: 20px;">
                <div class="team team-left" style="flex: 1; border-radius: 10px; padding: 15px; background-color: #FFEBEE;">
                    <h3 style="text-align: center; margin-bottom: 10px; font-size: 18px; color: #333;">Top Number</h3>
                    <div id="number-list-view" class="team-stats" style="gap: 5px; margin-bottom: 15px; display: flex; flex-direction: row;">
                        
                    </div>
                </div>

                </div>
                <div class="navigation" style="display: flex; width: 100%; justify-content: space-between;">
                <button class="btn-action-his btn-his-next nav-btn next-btn" style="background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; padding: 8px 12px 8px 15px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 14px; color: #555; transition: all 0.2s;">
                    Tiếp theo <i class="fas fa-chevron-right"></i>
                </button>    
                <button class="btn-action-his nav-btn prev-btn btn-his-pre" style="background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; padding: 8px 15px 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 14px; color: #555; transition: all 0.2s;">
                    <i class="fas fa-chevron-left"></i> Trước đó
                </button>
                </div>
                <div class="winning-wallets">
                <h4 style="font-size: 14px; margin-bottom: 8px; color: #555;">Ví thắng</h4>
                <ul id="win-wallets-view" style="list-style: none; padding: 0; margin: 0;"></ul>
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

            // New Bet
            const ctn_new_bet = document.createElement('div')
            ctn_new_bet.className = "new-bet-widget"
            const marqueeText = document.createElement('div');
            marqueeText.id = "new_bet"
            marqueeText.className = 'marquee new_bet';

            ctn_new_bet.appendChild(marqueeText);
            container.appendChild(ctn_new_bet)
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
                        showNoti("🔴 Số dư không đủ để thanh toán hoặc trả phí")
                    }
                    if (error.toString().includes('user rejected')) {
                        showNoti("🔴 Giao dịch đã bị hủy")
                    }
                    return { status: false, data: error }
                }
            }

            function showNoti(noti, type = false) {
                // background_swap.className = "bg-modal-widget none"
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
            // const closed_swap = document.getElementById('closed-swap')
            // const input_coin = document.getElementById('input-coin')
            // const swap = document.getElementById('swap_btn')

            function reRenderHis(index) {
                const item = histories[index]

                if (item) {

                    const block_view = document.getElementById("block-view")
                    const result_view = document.getElementById("result-view")
                    const win_rate_view = document.getElementById("win-rate-view")
                    const total_bet_view = document.getElementById("total-bet-view")
                    const win_amount_view = document.getElementById("win-amount-view")
                    const win_wallets_view = document.getElementById("win-wallets-view")
                    const block_detail_view = document.getElementById("block-detail-view")
                    const result_container = document.getElementById("result-container")

                    block_detail_view.href = `https://www.blockchain.com/explorer/blocks/btc/${item.block}`
                    if (item?.numbers) {
                        const number_list_view = document.getElementById("number-list-view")
                        number_list_view.style = "justify-content: center; gap: 5px; display: flex; flex-direction: row;"
                        number_list_view.innerHTML = ""
                        item?.numbers.map(num => {
                            const bet_num = document.createElement('div')
                            bet_num.style = `font-size: 20px; padding: 5px; font-weight: 700; color: ${num == item.result ? color.green : ""}`
                            bet_num.innerText = num
                            number_list_view.appendChild(bet_num)
                        })
                    }

                    result_container.style.backgroundColor = item.result < 50 ? color.red : color.green;
                    block_view.innerText = item.block;
                    result_view.innerText = item.result;
                    win_rate_view.innerText = item?.win_rate + "%";
                    total_bet_view.innerText = item?.total_bet + gameData.symbol;
                    win_amount_view.innerText = item?.pot + gameData.symbol;

                    let win_wallets_html = '';
                    item?.wallets_win?.forEach(win => {
                        win_wallets_html = win_wallets_html + `
                        <li style="font-size: 13px; margin-bottom: 5px; display: flex; justify-content: space-between; gap: 10px;">
                            ${win.wallet.substring(0, 7)}...${win.wallet.substring(35)}
                            <span style="color:rgb(214, 59, 59); font-weight: 600;">-${win.bet_amount} ${gameData.symbol}</span>
                            <span style="color: #4CAF50; font-weight: 600;">+${win.win_amount} ${gameData.symbol}</span>
                            <span><a target="_blank" href="${getNetwork(gameData.chain_id).scan_url}/tx/${win?.tx_hash}">Chi tiết</a></span>
                        </li>
                        `
                    })
                    win_wallets_view.innerHTML = win_wallets_html;

                    hisIndex = index
                }
            }

            // async function swapToken(amountInBNB, tokenOut, coinIn = "0xae13d989dac2f0debff460ac112a837c89baa7cd") {
            //     try {
            //         // Kiểm tra xem trình duyệt có hỗ trợ Ethereum không (MetaMask hoặc ví tương tự)
            //         if (!window.ethereum) {
            //             showNoti("🔴 Please install MetaMask or another Ethereum-compatible wallet!");
            //             return;
            //         }

            //         // Tạo provider từ window.ethereum
            //         const provider = new ethers.providers.Web3Provider(window.ethereum);

            //         // Yêu cầu người dùng kết nối ví
            //         await provider.send("eth_requestAccounts", []);
            //         const signer = provider.getSigner();
            //         const userAddress = await signer.getAddress(); // Lấy địa chỉ ví của người dùng

            //         const PANCAKESWAP_ROUTER = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
            //         const WBNB = coinIn;

            //         // Tạo contract instance với signer
            //         const router = new ethers.Contract(
            //             PANCAKESWAP_ROUTER,
            //             [
            //                 "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)",
            //                 "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
            //             ],
            //             signer
            //         );

            //         // Kiểm tra số dư BNB của ví người dùng
            //         const balance = await provider.getBalance(userAddress);
            //         if (balance.lt(ethers.utils.parseEther(amountInBNB))) {
            //             showNoti("🔴 Insufficient tBNB balance");
            //             return;
            //         }

            //         const amountInWei = ethers.utils.parseEther(amountInBNB);
            //         const path = [WBNB, tokenOut];
            //         const to = userAddress;
            //         const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

            //         // Kiểm tra lượng token dự kiến nhận được
            //         const amounts = await router.getAmountsOut(amountInWei, path);
            //         const amountOutMin = amounts[1].mul(95).div(100);

            //         // Thực hiện giao dịch swap
            //         const tx = await router.swapExactETHForTokens(
            //             amountOutMin,
            //             path,
            //             to,
            //             deadline,
            //             {
            //                 value: amountInWei,
            //                 gasLimit: ethers.BigNumber.from("500000")
            //             }
            //         );
            //         const receipt = await tx.wait();

            //         if (receipt) {

            //         }
            //     } catch (error) {
            //         if (error.toString().includes('estimate gas')) {
            //             showNoti("🔴 Insufficient balance")
            //         }
            //         if (error.toString().includes('user rejected')) {
            //             showNoti("🔴 Transaction canceled")
            //         }
            //     }
            // }


            btnwallet.addEventListener('click', async () => {
                const provider = typeof window.ethereum !== "undefined"
                    ? new ethers.providers.Web3Provider(window.ethereum)
                    : null;



                if (provider) {
                    const expectedChainId = '0x' + Number(gameData.chain_id).toString(16)
                    try {
                        const network = await provider.getNetwork();
                        if (network.chainId !== Number(gameData.chain_id)) {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: expectedChainId }],
                            });
                        }
                    } catch (error) {
                        const chain = getNetwork(gameData?.chain_id)
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: expectedChainId,
                                chainName: chain.name,
                                nativeCurrency: { name: chain.native_currency, symbol: chain.symbol, decimals: 18 },
                                rpcUrls: [chain.rpc_url],
                                blockExplorerUrls: [chain.scan_url],
                            }],
                        });
                    }

                    try {
                        await window.ethereum.request({ method: "eth_requestAccounts" });
                        singer_wallet = provider.getSigner();
                        const address = await singer_wallet.getAddress();
                        btnwallet_text.innerText = `${address.slice(0, 6)}...${address.slice(-4)}`;
                        btnwallet.disabled = true;
                        currentWallet = address;
                        historyData(hisData)
                    } catch (err) {
                        showNoti("🔴 Kết nối ví thất bại ")
                    }
                } else {
                    showNoti("⚠️ Tải xuống Metamask để tham gia trò chơi này");
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

            );
            closed_his.addEventListener('click', () => {
                background_modal.className = "bg-modal-widget none"
            })
            // closed_swap.addEventListener('click', () => {
            //     background_swap.className = "bg-modal-widget none"
            // })
            his_Prev.addEventListener('click', function () {
                reRenderHis(hisIndex + 1)
            });

            his_Next.addEventListener('click', function () {
                reRenderHis(hisIndex - 1)
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
            // swap_btn.addEventListener('click', () => {
            //     background_swap.className = "bg-modal-widget block"
            // })

            // swap.addEventListener('click', () => {
            //     swapToken(input_coin.value, gameData.contract_address)

            // })

            // input_coin.addEventListener('input', (e) => {
            //     const swap_value = document.getElementById('input-token')
            //     swap_value.value = (e.target.value) * 1000000
            // })
            btn_bet.addEventListener('click', async () => {
                const numbers = NumberBtn.filter(item => item.status).map(item => item.number)
                const value = Number(input.value);

                const checkValue = () => {
                    if (value > Number(gameData.max_bet_amount)) {
                        showNoti(`🟡 Cược tối đa ${gameData.max_bet_amount} ${gameData.symbol}`)
                        return false
                    }
                    if (value < Number(gameData.min_bet_amount)) {
                        showNoti(`🟡 Cược tối thiểu ${gameData.min_bet_amount} ${gameData.symbol}`)
                        return false
                    }
                    return true
                }
                if (!checkValue()) {
                    return;
                }

                if (!currentWallet) {
                    showNoti(`🟡 Kết nối ví Metamask để chơi!!`)
                    return;
                }
                if (!value) {
                    showNoti(`🟡 Chưa nhập số lượng muốn cược!!`)
                    return;
                }
                if (numbers.length <= 0) {
                    showNoti(`🟡 Chưa chọn số muốn đặt cược !!`)
                    return;
                }

                showNoti(`🟡 Đang thực hiện giao dịch...`, true)
                const input_value = (Number(value) * numbers.length).toString()
                const tx = await TransferToken(input_value)
                if (tx.status) {
                    const body = (num) => {
                        return num.map(item => {
                            return {
                                "game_id": gameData.id,
                                "wallet_address": currentWallet,
                                "block_height": betBlock(current_block.height).toString(),
                                "choice": item,
                                "bet_amount": value.toString(),
                                "bet_tx_hash": tx.data.transactionHash,
                            }

                        })
                    }
                    const promise = await fetch(`${urlAction.bet}`, {
                        method: "POST",
                        body: JSON.stringify(body(numbers))
                    })
                        .then(() => true).catch(() => false)

                    if (promise) {
                        showNoti(`🟢 đã cược ${NumberBtn.filter((item) => item.status).length * value} ${gameData.symbol} cho các số ${numbers.join(", ")}`, true)
                        add_coin.play()
                    } else {
                        showNoti('🔴 Đặt cược thất bại !')
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

    // render marqueText
    function renderCommingSoon() {
        const container = document.getElementById(containerId)
        container.style = `display: flex; justify-content: center; padding-top: 20px`

        const style = document.createElement('style');
        style.textContent = `
      * {
        margin: 0; padding: 0; box-sizing: border-box;
        font-family: 'Arial', sans-serif;
      }
      body {
        background-color: #0f172a;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=');
      }
      .container {
        max-width: 600px;
        width: 90%;
        padding: 2rem;
        background-color: rgba(30, 41, 59, 0.8);
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        text-align: center;
        animation: fadeIn 1s ease-out;
      }
      h1 {
        color: #f8fafc;
        margin-bottom: 1.5rem;
        font-size: 2rem;
      }
      .notification {
        background-color: #334155;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        position: relative;
        overflow: hidden;
      }
      .notification::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 5px;
        height: 100%;
        background-color: #3b82f6;
      }
      .message {
        font-size: 1.2rem;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      .countdown {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }
      .countdown-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80px;
      }
      .countdown-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #3b82f6;
        background-color: #1e293b;
        border-radius: 8px;
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .countdown-label {
        font-size: 0.9rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .btn {
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
        letter-spacing: 0.5px;
      }
      .btn:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .btn:active {
        transform: translateY(0);
      }
      .disabled {
        background-color: #64748b;
        cursor: not-allowed;
      }
      .disabled:hover {
        background-color: #64748b;
        transform: none;
        box-shadow: none;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .pulse {
        animation: pulse 2s infinite;
      }
    `;
        document.head.appendChild(style);

        // ===== 2. Create HTML Elements via JS =====
        const containerNoti = document.createElement('div');
        containerNoti.className = 'container';
        container.appendChild(containerNoti);

        const title = document.createElement('h1');
        title.textContent = 'Thông Báo Mở Cửa Trò Chơi';
        containerNoti.appendChild(title);

        const notification = document.createElement('div');
        notification.className = 'notification';
        containerNoti.appendChild(notification);

        const message = document.createElement('p');
        message.className = 'message';
        const openTime = document.createElement('strong');
        openTime.id = 'openTime';
        message.innerHTML = `Trò chơi sẽ chính thức mở cửa vào lúc ${new Date(gameData.open_time).toLocaleString("vi-VN")}`;
        message.appendChild(openTime);
        message.innerHTML += '. Hãy chuẩn bị sẵn sàng để tham gia!';
        notification.appendChild(message);

        const countdown = document.createElement('div');
        countdown.className = 'countdown';
        containerNoti.appendChild(countdown);

        const units = ['Ngày', 'Giờ', 'Phút', 'Giây'];
        const ids = ['days', 'hours', 'minutes', 'seconds'];

        ids.forEach((id, i) => {
            const item = document.createElement('div');
            item.className = 'countdown-item';

            const value = document.createElement('div');
            value.className = 'countdown-value';
            value.id = id;
            value.textContent = '00';

            const label = document.createElement('div');
            label.className = 'countdown-label';
            label.textContent = units[i];

            item.appendChild(value);
            item.appendChild(label);
            countdown.appendChild(item);
        });

        // ===== 3. Logic countdown + format thời gian =====
        const openDate = new Date(gameData.open_time).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = openDate - now;

            let [d, h, m, s] = [0, 0, 0, 0];
            if (distance > 0) {
                d = Math.floor(distance / (1000 * 60 * 60 * 24));
                h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                s = Math.floor((distance % (1000 * 60)) / 1000);
            }

            document.getElementById('days').textContent = d.toString().padStart(2, '0');
            document.getElementById('hours').textContent = h.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = s.toString().padStart(2, '0');

            if (distance <= 0) {
                clearInterval(timer);
                document.querySelector('.message').innerHTML = '<strong>Trò chơi chưa được phát hành. Hãy đợi thông báo chính thức và quay lại sau.</strong>';
            }
        };

        // Cập nhật định dạng thời gian mở cửa
        const openDateObj = new Date(openDate);
        const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
        openTime.textContent = openDateObj.toLocaleString('vi-VN', options);

        // Chạy countdown mỗi giây
        const timer = setInterval(updateCountdown, 1000);
        updateCountdown(); // gọi lần đầu
    }

    function renderWillClose() {
        if (!gameData.close_time) {
            return;
        }
        const container = document.getElementById(containerId)

        const style = document.createElement('style');
        style.textContent = `
            body {
                overflow: hidden;
            }
            .marquee-container {
                position: absolute;
                bottom: 50px;
                width: 100%;
                overflow: hidden;
                height: 30px;
            }
            .marquee-text {
                white-space: nowrap;
                position: relative;
                color:rgb(255, 255, 255);
                font-weight: bold;
                font-size: 1.3em;
                left: 100%;
            }
        `;
        document.head.appendChild(style);

        const marqueeContainer = document.createElement('div');
        marqueeContainer.className = 'marquee-container';
        document.body.appendChild(marqueeContainer);

        const marqueeText = document.createElement('div');
        marqueeText.className = 'marquee-text';
        marqueeText.textContent = `🛠 Trò chơi sẽ tạm khóa vào lúc ${new Date(gameData.close_time).toLocaleString("vi-VN")} để bảo trì, hạn chế giao dịch vào trước khung giờ khóa 30 phút. 🛠`;
        marqueeContainer.appendChild(marqueeText);

        container.appendChild(marqueeText)

        // ===== JS animation =====
        let pos = window.innerWidth;
        let isPaused = false;

        function scrollText() {
            if (!isPaused) {
                pos--;
                if (pos < -marqueeText.offsetWidth) {
                    pos = window.innerWidth;
                }
                marqueeText.style.left = pos + 'px';
            }
            requestAnimationFrame(scrollText);
        }

        scrollText();
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
        if (data.status === 'draft') {
            gameData = data
            renderCommingSoon()
        } else {
            gameData = data
            changeFavicon(Image(gameData.contract_icon))
            getBlock().then(() => {
                connectBlockChain()
                connectGamedata()
                GenarateUI()
            })
            renderWillClose()
        }

    })

    window.addEventListener('unload', () => {
        Ssocket.close()
    })
})();
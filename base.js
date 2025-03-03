(function () {
    const containerId = 'jackpot-game-widget';
    let container = document.getElementById(containerId);
    if (!container) {
        console.error("Widget need 'jackpot-game-widget' box id")
        return;
    }

    const id = container.getAttribute("data-id") || null;
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
    let NumberBtn = Array(100).fill().map((_, i) => ({ number: (`0${i}`).slice(-2), status: false }));
    let currentWallet;
    let total_bet = 723423948;
    let histories = [
        { id: "9234293", size: "8342837", total: "283829" },
        { id: "9234292", size: "8342865", total: "6567653" },
        { id: "9234291", size: "8342835", total: "45364536" },
        { id: "9234290", size: "8342876", total: "3455345" },
        { id: "9234289", size: "8342890", total: "4395639.8457" },
        { id: "9234288", size: "8342872", total: "5645.786" },
        { id: "9234287", size: "8342801", total: "45.77" },
        { id: "9234286", size: "8342855", total: "436547.8" },
        { id: "9234285", size: "8342849", total: "46546.5" },
        { id: "9234284", size: "8342850", total: "926382.56" },
    ]
    // Hàm xử lý 
    function Image(id) {
        return `https://soc.bitrefund.co/assets/${id}`
    }

    async function data_game() {
        const data = await fetch(`https://get-game.nguyenxuanquynh1812nc1.workers.dev/${id}`, {
            method: "GET"
        })
            .then((data) => data.json())
            .then((data) => {
                return data.data
            })
            .catch((err) => {
                return null
            })

        const providerUrl = getNetwork(data.network).api_url + "/379175b6c6c3436eab583d759cdeea5e"

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
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE và Edge */
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
                margin-top: 20px;
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
                justify-content: right;
                gap: 5px
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
                max-height: 430px;
                max-width: 1020px;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .card-ctn-bet {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-evenly;
                margin-top: 10px;
                margin: 0px 20px;
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
                max-width: 500px;
                width: 100%;
                scrollbar-width: none;
                -ms-overflow-style: none; 
            }

            .group-actbtn-widget {
                display: flex;
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                gap: 10px;
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
            }
        `

        document.head.appendChild(style)
        document.head.appendChild(script)

        function createInitialElements() {
            const container = document.getElementById(containerId)
            container.style = `scrollbar-width: none;  -ms-overflow-style: none;  animation: moveBackground 30s infinite linear; overflow-x: hidden; overflow-y: scroll; background-image: url('https://game-widget.vercel.app/images/decktop.jpg');height: 100%; width: 100%;`

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
                
                <h3>Game Requirements:</h3>
                <p>To play, you need to connect your Metamask wallet. You will need BNB for transaction fees and the <strong>${gameData.symbol}</strong> specified by the game creator for in-game transactions.</p>

                <h3>How to Play:</h3>
                <p>After connecting your wallet, <span class="text-highlight-widget">select 1 to 10 numbers from 00 to 99.</span> Then, enter the amount of tokens you wish to bet. The bet will be equally distributed across the numbers you selected. Finally, click the "Play" button to place your bet.</p>

                <h3>After Each Block is Confirmed:</h3>
                <p>The game will use <span class="text-highlight-widget"> the last two digits of the block size </span> as the result.</p>
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
            const title_his = document.createElement('p')
            title_his.className = "tilte-modal-widget"
            title_his.innerText = "History games"
            const content_his = document.createElement('div')
            content_his.className = "content-modal-his-widget"
            histories.forEach(item => {
                const his_item = document.createElement('div')
                his_item.style = `
                     display: flex;
                     flex: 1;
                     text-align: center;
                     padding: 10px;
                     box-sizing: border-box;
                     flex-direction: row;
                     justify-content: center;
                     align-items: center; 
                     gap: 10px;
                 `
                const his_id = document.createElement('p')
                his_id.innerText = new Intl.NumberFormat('de-DE').format(item.total)
                his_id.className = "text-black merienda-text-widget"
                his_id.style = `
                     text-wrap: nowrap
                 `
                const his_size = document.createElement('div')
                his_size.style = `
                     border-radius: 5px;
                     background-color: ${color.orange};
                     font-family: "Merienda", serif;
                     font-weight: 700;
                     color: white;
                     padding: 10px;
                     font-size: 12px
                 `
                his_size.textContent = item.size.substring(item.size.length - 2)

                his_item.appendChild(his_id)
                his_item.appendChild(his_size)
                content_his.appendChild(his_item)
            })
            card_modal.appendChild(title_his)
            card_modal.appendChild(content_his)
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
            action_div.className = "action-div-widget"
            const history_btn = document.createElement('div')
            history_btn.className = "action-btn-widget history-btn-widget"
            const his_icon = document.createElement('img')
            his_icon.className = "his-icon-widget"
            his_icon.src = "https://game-widget.vercel.app/images/history.png"
            const info_btn = document.createElement('div')
            info_btn.className = "action-btn-widget info-btn-widget"
            info_btn.textContent = '?'
            history_btn.appendChild(his_icon)
            action_div.appendChild(history_btn)
            action_div.appendChild(info_btn)
            container.appendChild(action_div)

            // Pig Image
            const ctn_pig = document.createElement('div')
            ctn_pig.className = "ctn-pig-widget"
            ctn_pig.innerHTML = `
                <dotlottie-player src="https://lottie.host/d0e9200a-390f-4ddc-bc4a-cc834aae42af/ZIbJe8tm8f.lottie"
                background="transparent" speed="1" style="width: 200px; height: 200px" loop autoplay></dotlottie-player>
                <p id="count_bet" class="ctn-jackpot-widget">${new Intl.NumberFormat('de-DE').format(total_bet)} ${gameData.symbol}</p>
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
            top.style = `gap: 20px; display: flex; flex-direction: row; width: 100%;`
            const ctn_input = document.createElement('div')
            ctn_input.style = `
                width: 100%;flex: 1;align-items: center; border-radius: 5px; display: flex;flex-direction: row;gap: 10px;padding: 10px;background-color: #151F3B;
            `
            const img = document.createElement('img')
            img.src = Image(gameData.icon)
            img.style = `
                width: 30px;
                height: 30px;
            `
            const input = document.createElement('input')
            input.placeholder = "Enter token"
            input.type = 'number'
            input.style = `font-family: "Merienda", serif; font-weight: 700;outline:none; background-color: transparent; border: none; color:white; font-size: 1.25rem;`
            ctn_input.appendChild(img)
            ctn_input.appendChild(input)
            top.appendChild(ctn_input)
            card_ctn_bet.appendChild(top)
            const btn_bet = document.createElement('button')
            btn_bet.style = `cursor: pointer; border-radius: 5px; color: white; padding: 0px 20px;border: 0px; font-size: 18px; font-family: "Merienda", serif; font-weight: 700;outline:none; height: 50px;background-image: linear-gradient(${color.top_neon}, ${color.bot_neon})`
            btn_bet.textContent = "Play"
            top.appendChild(btn_bet)
            const_ct_bet.appendChild(top)
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
            const_ct_bet.appendChild(ctn_btn_action)
            card_ctn_bet.appendChild(const_ct_bet)
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
                    const recipient = gameData.wallet_address;
                    const decimals = await tokenContract.decimals();
                    const amount = ethers.utils.parseUnits(value, decimals);
                    const tx = await tokenContract.transfer(recipient, amount);
                    return true
                } catch (error) {
                    return false
                }
            }

            function showNoti(noti, type = false) {
                title_noti.innerText = noti
                background_modal_noti.className = "bg-modal-widget block"
                if (!type) {
                    error.play()
                }

            }

            // Btn action
            const btnwallet = document.querySelector('.btn-wallet-widget');
            const btnwallet_text = document.querySelector('.btn-wallet-text-widget');
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

                        showNoti(address)
                        btnwallet_text.innerText = `✅ ${address.slice(0, 6)}...${address.slice(-4)}`;
                        btnwallet.disabled = true;
                    } catch (err) {
                        showNoti("Cannot connect Wallet on Phone")
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
                        } catch (err) {
                            showNoti("Connect Wallet failed ")
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
            background_modal.addEventListener('click', () => {
                background_modal.className = "bg-modal-widget none"
            })
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
            btn_bet.addEventListener('click', async () => {
                const numbers = NumberBtn.filter(item => item.status)
                const value = Number(input.value);
                if (!currentWallet) {
                    showNoti(`Connect Metamask wallet to play!!`)
                    return;
                }
                if (!value) {
                    showNoti(`Please enter token to bet!!`)
                    return;
                }
                if (!numbers.length) {
                    showNoti(`Please choose 1 - 10 number !!`)
                    return;
                }
                const tx = true
                if (tx) {
                    add_coin.play()
                    showNoti(`You bet ${value} ${gameData.symbol} for ${numbers.map(item => item.number).join(", ")}`, true)
                    const count_bet = document.getElementById('count_bet')
                    count_bet.textContent = new Intl.NumberFormat('de-DE').format(total_bet + value)
                    total_bet += value
                } else {
                    showNoti('Have a problem. Please try again !')
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
            })
            remove.addEventListener('click', () => {
                NumberBtn = Array(100).fill().map((_, i) => ({ number: (`0${i}`).slice(-2), status: false }));
                const numbers = document.querySelectorAll('.btn_num_bet')
                numbers.forEach((el) => {
                    el.style = renderUi(`background-color: ${color.btn_dis}`)
                })

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
        }
    }

    // Start 
    import_js()
    data_game().then((data) => {
        gameData = data
        GenarateUI()

    })
})();
const textarea = document.querySelector('.chatbox-message-input')
    const chatboxForm = document.querySelector('.chatbox-message-form')

    textarea.addEventListener('input', function () {
        let line = textarea.value.split('\n').length

        if(textarea.rows < 6 || line < 6) {
            textarea.rows = line
        }

        if(textarea.rows > 1) {
            chatboxForm.style.alignItems = 'flex-end'
        } else {
            chatboxForm.style.alignItems = 'center'
        }
    })

    // TOGGLE CHATBOX
    const chatboxToggle = document.querySelector('.chatbox-toggle')
    const chatboxMessage = document.querySelector('.chatbox-message-wrapper')

    chatboxToggle.addEventListener('click', function () {
        chatboxMessage.classList.toggle('show')
        autoReply()
    });
    const chatboxMessageWrapper = document.querySelector('.chatbox-message-content')
    const chatboxNoMessage = document.querySelector('.chatbox-message-no-message')
    const chatboxStatus = document.querySelector('.chatbox-status')

    chatboxForm.addEventListener('submit', function (e) {
        e.preventDefault()

        if(isValid(textarea.value)) {
            chatboxStatus.innerHTML = "Sending..."
            setTimeout( function() {
                chatboxStatus.style.display = 'none'
            },2000);
            setTimeout(writeMessage, 2000)
        }
    })



    function addZero(num) {
        return num < 10 ? '0'+num : num
    }

    function writeMessage() {
        const today = new Date()
        let message = `
            <div class="chatbox-message-item sent">
                <span class="chatbox-message-item-text">
                    ${textarea.value.trim().replace(/\n/g, '<br>\n')}
                </span>
                <span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
            </div>
        `
        chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)

        chatboxForm.style.alignItems = 'center'
        textarea.rows = 1
        textarea.focus()
        textarea.value = ''
        chatboxNoMessage.style.display = 'none'
        scrollBottom()
    }

    function autoReply() {
        const today = new Date()
        let message = `
            <div class="chatbox-message-item received">
                <span class="chatbox-message-item-text">
                Thank you for contacting Happy Meal Support! Please type your question for help
                </span>
                <span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
            </div>
        `
        chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
        scrollBottom()
    }

    function scrollBottom() {
        chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight)
    }

    function isValid(value) {
        let text = value.replace(/\n/g, '')
        text = text.replace(/\s/g, '')

        return text.length > 0
    }
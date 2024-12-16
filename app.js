let hasInitialized = false;


document.addEventListener('DOMContentLoaded', async () => {
    
    if (hasInitialized) return;
    hasInitialized = true;

    try {
        const isFirstLoad = !localStorage.getItem('hasInitialized');
        
        if (isFirstLoad) {
            // First time loading
            const data = await getdata();
            if (data) {
                unorder_list.innerHTML = ''; // Clear any existing content
                renderComments(data.comments);
                add_section();
                localStorage.setItem('hasInitialized', 'true');
                saveDOMState();
            }
        } else {
            // Loading saved state
            if (!loadDOMState()) {
                // If loading saved state fails, load from data.json
                const data = await getdata();
                if (data) {
                    unorder_list.innerHTML = ''; // Clear any existing content
                    renderComments(data.comments);
                    add_section();
                    saveDOMState();
                }
            }
        }
        attachEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Add cleanup
window.addEventListener('unload', () => {
    hasInitialized = false;
});


// Initialize DOM elements
const [list_template, main_section, unorder_list] = document.querySelectorAll('#list-template, #Interactive-comments-section, #unorder-list');
const [reply_templates_section, replay_paragraph, reply_name_tag] = document.querySelectorAll('#reply-template, .reply-paragraph, .reply-name');
const [add_template, add_paragraph, send_button] = document.querySelectorAll('#create-add-comment, .add-paragraph, .add-paragraph');

// Initialize state
let initialComments = [];

// Fetch data
async function getdata() {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Error fetching data');
    const data = await response.json();
    initialComments = data.comments;
    return data;
}

// Create comment section
function createcommentsection(comment) {
    const {user, content, createdAt, score} = comment;
    const comment_template = list_template.content.cloneNode(true).firstElementChild;
    const [score_votes, heading, time_at, inside_text] = comment_template.querySelectorAll('.vote-counting-number, .heading, .time, .text-comment');
    const img = comment_template.querySelector('.img');
    
    if (heading && inside_text && img && time_at) {
        score_votes.textContent = score || 0;
        heading.textContent = user.username;
        inside_text.textContent = content;
        time_at.textContent = createdAt;
        img.src = user.image.png;
    }
    
    return comment_template;
}

// Render comments
function renderComments(comments) {
    if (!comments) return;
    comments.forEach(comment => {
        const commentSection = createcommentsection(comment);
        unorder_list.appendChild(commentSection);
        if (comment.replies?.length > 0) {
            comment.replies.forEach(reply => {
                const reply_section = createcommentsection(reply);
                unorder_list.appendChild(reply_section);
            });
        }
    });
}

// Add comment section
function add_section() {
    const add_template_section = add_template.content.cloneNode(true).firstElementChild;
    unorder_list.appendChild(add_template_section);
}

// Handle voting
function add_minus() {
    const list_plus = unorder_list.querySelectorAll('.plus:not(.bound)');
    const list_minus = unorder_list.querySelectorAll('.minus:not(.bound)');

    list_plus.forEach(plus => {
        plus.classList.add('bound');
        plus.addEventListener('click', () => {
            const numberElement = plus.closest('li').querySelector('.vote-counting-number');
            numberElement.textContent = parseInt(numberElement.textContent || '0') + 1;
            saveDOMState();
        });
    });

    list_minus.forEach(minus => {
        minus.classList.add('bound');
        minus.addEventListener('click', () => {
            const numberElement = minus.closest('li').querySelector('.vote-counting-number');
            const currentValue = parseInt(numberElement.textContent || '0');
            if (currentValue > 0) {
                numberElement.textContent = currentValue - 1;
                saveDOMState();
            }
        });
    });
}

// Handle replies
function reply() {
    const reply_buttons = unorder_list.querySelectorAll('.button-reply:not(.bound)');
    const names_reply = unorder_list.querySelectorAll('.heading');
    const type_area = unorder_list.querySelector('.text');

    reply_buttons.forEach((button, index) => {
        button.classList.add('bound');
        button.addEventListener('click', () => {
            type_area.value = `@${names_reply[index].textContent} `;
        });
    });
}

// Send message
function send_message() {
    const send_button = unorder_list.querySelector('.send:not(.bound)');
    if (!send_button) return;
    
    send_button.classList.add('bound');
    send_button.addEventListener('click', () => {
        const type_area = unorder_list.querySelector('.text');
        const reply_section = reply_templates_section.content.cloneNode(true).firstElementChild;
        const [img_src, reply_name, time, paragraph_text] = reply_section.querySelectorAll(
            '.reply-img, .heading-2, .time-reply, .replay-paragraph'
        );

        if (type_area.value.trim()) {
            img_src.src = 'images/avatars/img.jpg';
            reply_name.textContent = 'cobra kai';
            time.textContent = '1 hour ago';
            paragraph_text.textContent = type_area.value;
            
            unorder_list.insertBefore(reply_section, unorder_list.querySelector('.add-section'));
            type_area.value = '';
            
            attachEventListeners();
            saveDOMState();
        }
    });
}

// Delete reply
function deletereply() {
    const delete_buttons = unorder_list.querySelectorAll('.delete-button:not(.bound)');
    
    delete_buttons.forEach(button => {
        button.classList.add('bound');
        button.addEventListener('click', () => {
            const reply_section = button.closest('li');
            if (reply_section) {
                reply_section.remove();
                saveDOMState();
            }
        });
    });
}

// Edit comment
function edit_comment() {
    const edit_buttons = unorder_list.querySelectorAll('.edit:not(.bound)');
    
    edit_buttons.forEach(button => {
        button.classList.add('bound');
        const originalContent = button.innerHTML;

        button.addEventListener('click', () => {
            const paragraph = button.closest('li').querySelector('.replay-paragraph');
            if (!paragraph) return;

            if (button.textContent.trim() === 'Save') {
                paragraph.setAttribute('contenteditable', 'false');
                paragraph.style.border = 'none';
                button.innerHTML = originalContent;
                saveDOMState();
            } else {
                button.textContent = 'Save';
                paragraph.setAttribute('contenteditable', 'true');
                paragraph.focus();
                paragraph.style.border = '1px solid black';
            }
        });
    });
}

// Save state
function saveDOMState() {
    const state = {
        comments: Array.from(unorder_list.querySelectorAll('li[id="comment"]')).map(comment => ({
            user: {
                username: comment.querySelector('.heading').textContent,
                image: { png: comment.querySelector('.img').src }
            },
            content: comment.querySelector('.text-comment').textContent,
            createdAt: comment.querySelector('.time').textContent,
            score: comment.querySelector('.vote-counting-number').textContent
        })),
        replies: Array.from(unorder_list.querySelectorAll('li[id="replay-id"]')).map(reply => ({
            user: {
                username: reply.querySelector('.heading-2').textContent,
                image: { png: reply.querySelector('.reply-img').src }
            },
            content: reply.querySelector('.replay-paragraph').textContent,
            createdAt: reply.querySelector('.time-reply').textContent,
            score: reply.querySelector('.vote-counting-number').textContent
        }))
    };
    
    localStorage.setItem('domState', JSON.stringify(state));
}

// Load state
function loadDOMState() {
    const savedState = localStorage.getItem('domState');
    if (!savedState) return false;

    try {
        const state = JSON.parse(savedState);
        unorder_list.innerHTML = '';

        state.comments.forEach(comment => {
            const commentSection = createcommentsection(comment);
            unorder_list.appendChild(commentSection);
        });

        state.replies.forEach(reply => {
            const replySection = reply_templates_section.content.cloneNode(true).firstElementChild;
            replySection.querySelector('.vote-counting-number').textContent = reply.score;
            replySection.querySelector('.heading-2').textContent = reply.user.username;
            replySection.querySelector('.time-reply').textContent = reply.createdAt;
            replySection.querySelector('.replay-paragraph').textContent = reply.content;
            replySection.querySelector('.reply-img').src = reply.user.image.png;
            unorder_list.appendChild(replySection);
        });

        add_section();
        return true;
    } catch (error) {
        console.error('Error loading state:', error);
        return false;
    }
}

// Attach all event listeners
function attachEventListeners() {
    reply();
    add_minus();
    edit_comment();
    deletereply();
    send_message();
}



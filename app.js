
// select the elements form the dom

const [list_template, main_section, unorder_list] = document.querySelectorAll('#list-template, #Interactive-comments-section, #unorder-list');
const [reply_templates_section,replay_paragraph,reply_name_tag ] = document.querySelectorAll('#reply-template,  .reply-paragraph, .reply-name');
const [add_template,add_paragraph,send_button] = document.querySelectorAll('#create-add-comment, .add-paragraph, .add-paragraph');



// fecting the data from dat.json file


async function getdata() {
  
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error('Error');
    }
    const data = await response.json();
    return data;

}

getdata().then(data => {
    if (data) {
      const { currentUser, comments } = data;
  
      // Log the data after it has been fetched
      console.log('Fetched comments:', comments);
      console.log('Fetched currentUser:', currentUser);

     
    renderComments(comments);
    add_section();
    reply();
    send_message();
    add_minus(); // Attach event listeners initially
    edit_comment(); // Attach event listeners initially
    deletereply(); // Attach event listeners initially
  

      
        
    }
   
    
  });




// create the comment section


function createcommentsection (comment) {
    const {user, content, createdAt,score} = comment;
    const comment_template = list_template.content.cloneNode(true).firstElementChild;
    const [score_votes, heading, time_at, inside_text] = comment_template.querySelectorAll('.vote-counting-number, .heading,.time, .text-comment');
    const img = comment_template.querySelector('.img');
    if (heading && inside_text && img && time_at && score) {
        score_votes.textContent = score; // Assign score to score_votes
        heading.textContent = user.username;
        inside_text.textContent = content; // Assign content to inside_text
        time_at.textContent = createdAt; // Assign createdAt to time_at
        img.src = user.image.png;
        
    }
    
    
    return comment_template;
}


// coverting the object to an array and running the loop and calling th fuction to create the comment section



function renderComments(comments) {
    const commentsContainer = unorder_list;
    if (comments) {
        comments.forEach(comment => {
            const commentSection = createcommentsection(comment);
            commentsContainer.appendChild(commentSection);
            if (comment.replies.length > 0) {
                comment.replies.forEach(reply => {
                  const reply_section = createcommentsection(reply);
                  commentsContainer.appendChild(reply_section);
                });
              }
        });
    }
    add_minus(); // Attach event listeners after rendering comments
    edit_comment(); // Attach event listeners after rendering comments
    deletereply(); // Attach event listeners after rendering comments
    }
  
    // adding the section to the comment section

    function add_section() {
        const add_template_section = add_template.content.cloneNode(true).firstElementChild;
        unorder_list.appendChild(add_template_section);
    }


    function add_minus() {
        const list_plus = unorder_list.querySelectorAll('.plus:not(.bound)');
        const list_minus = unorder_list.querySelectorAll('.minus:not(.bound)');
    
        list_plus.forEach((plus) => {
          plus.classList.add('bound');
          plus.addEventListener('click', () => {
            const numberElement = plus.closest('li').querySelector('.vote-counting-number');
            if (numberElement.textContent.trim() === '' || numberElement.textContent === '0') {
              numberElement.textContent = '1';
            } else {
              numberElement.textContent = parseInt(numberElement.textContent) + 1;
            }
          });
        });
      
        list_minus.forEach((minus) => {
          minus.classList.add('bound');
          minus.addEventListener('click', () => {
            const numberElement = minus.closest('li').querySelector('.vote-counting-number');
            if (numberElement.textContent.trim() === '' || numberElement.textContent === '0') {
              // do nothing
            } else {
              numberElement.textContent = parseInt(numberElement.textContent) - 1;
            }
          });
        });
      }

   

    function reply() {
        const reply_button  = unorder_list.querySelectorAll('.button-reply');
        const names_reply =  unorder_list.querySelectorAll('.heading');
        let type_area = unorder_list.querySelector('.text');
       
        reply_button.forEach((replies, index)=> {
            replies.addEventListener('click', () => {
            const get_name = names_reply[index].textContent;
            type_area.value = `@${get_name} `; // Use .value for textareas
             

            });
        });
    }
    

    function send_message () {
     
        const send_button = unorder_list.querySelector('.send');
        const divElement = unorder_list.querySelector('.add-section');
        send_button.addEventListener('click', () => {

        
        const type_area = unorder_list.querySelector('.text');
        const reply_section = reply_templates_section.content.cloneNode(true).firstElementChild;
        const [img_src, reply_name ,  time, paragraph_text ] = reply_section.querySelectorAll('.reply-img, .heading-2  , .time-reply, .replay-paragraph');

            if (img_src && reply_name && time) {
                img_src.src = 'images/avatars/img.jpg';
                reply_name.textContent = 'cobra kai';
                time.textContent = "1 hour ago";
                paragraph_text.textContent = type_area.value;
                
              }

              type_area.value = '';

             edit_comment();
             

              unorder_list.insertBefore(reply_section, divElement);

              
              add_minus(); // Attach event listeners to newly added elements
              deletereply(); // Attach event listeners to newly added elements
              edit_comment(); // Attach event listeners to newly added elements
               
        });

    }

function deletereply() {
    const delete_button = unorder_list.querySelectorAll('.delete-button');
    const reply_section = unorder_list.querySelectorAll('#reply-id');

    delete_button.forEach((deletes) => {
        deletes.addEventListener('click', () => {
            const reply_section = deletes.closest('li');
            if (reply_section) {
                reply_section.remove();
            } else {
                console.error('Could not find the parent element');
            }
           
        });
    });
}

function edit_comment() {
    const edit_buttons = unorder_list.querySelectorAll('.edit');
    
    edit_buttons.forEach(edit_button => {
      // Store the original content of the edit button
      const originalContent = edit_button.innerHTML;
  
      edit_button.addEventListener('click', () => {
        const reply_section = edit_button.closest('li');
        if (!reply_section) {
          console.error('Could not find the parent li element');
          return;
        }
  
        const paragraph_edit = reply_section.querySelector('.replay-paragraph'); // Corrected class name
        if (!paragraph_edit) {
          console.error('Could not find the replay-paragraph element');
          return;
        }
        
        // Check if the button is in "Save" state
        if (edit_button.textContent.trim() === 'Save') {
          // Save the changes
          paragraph_edit.setAttribute('contenteditable', 'false');
          paragraph_edit.style.border = 'none';
          edit_button.innerHTML = originalContent;
        } else {
          // Change the edit button text to "Save"
          edit_button.textContent = 'Save';
          
          paragraph_edit.setAttribute('contenteditable', 'true');
          paragraph_edit.focus();
          paragraph_edit.style.border = '1px solid black';
        }
      });
    });
  }
  


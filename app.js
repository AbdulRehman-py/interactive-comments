
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

      reply_template();

      add_section();

      reply();

        add_minus();

        
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
    
    }
  
    // adding the section to the comment section

    function add_section() {
        const add_template_section = add_template.content.cloneNode(true).firstElementChild;
        unorder_list.appendChild(add_template_section);
    }



    function add_minus() {
       const list_plus =  unorder_list.querySelectorAll('.plus');
       const list_minus = unorder_list.querySelectorAll('.minus');
       const numbers_num =  unorder_list.querySelectorAll('.vote-counting-number');

        if (list_plus) {
            list_plus.forEach((plus, index) => {
                plus.addEventListener('click', () => {
                    numbers_num[index].textContent = parseInt(numbers_num[index].textContent) + 1;
                });
            });
        } 

        if (list_minus) {
            list_minus.forEach((minus, index) => {
                minus.addEventListener('click', () => {
                    numbers_num[index].textContent = parseInt(numbers_num[index].textContent) - 1;
                });
            });
        }

    }

    function reply_template() {
        const reply_section = reply_templates_section.content.cloneNode(true).firstElementChild;
        const [img_src, reply_name ,  time ] = reply_section.querySelectorAll('.reply-img, .heading-2  , .time-reply');
        const you_tag = reply_section.querySelector('.you');
        const [reply_paragraph,reply_name_tag] = reply_section.querySelectorAll('.reply-paragraph, .reply-name');
        if (img_src && reply_name && you_tag && time) {
            img_src.src = 'images/avatars/img.jpg';
            reply_name.textContent = 'cobra kai';
            you_tag.textContent = 'You';
            time.textContent = "1 hour ago";
            reply_paragraph.textContent = 'I am a big fan of cobra kai i just finished watching the season 6 and i am so excited for the final part of season 6 im wondering who will win im expeecting a twist';
            
          }

        unorder_list.appendChild(reply_section);
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
        const type_area = unorder_list.querySelector('.text');
        const reply_section = reply_templates_section.content.cloneNode(true).firstElementChild;
        const [img_src, reply_name ,  time ] = reply_section.querySelectorAll('.reply-img, .heading-2  , .time-reply');
    }


    
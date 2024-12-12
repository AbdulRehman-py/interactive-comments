
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
        
    }
   


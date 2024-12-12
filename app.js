
// select the elements form the dom

const [list_template, main_section, unorder_list] = document.querySelectorAll('#list-template, #Interactive-comments-section, #unorder-list');
const [reply_templates_section,replay_paragraph,reply_name_tag ] = document.querySelectorAll('#reply-template,  .reply-paragraph, .reply-name');
const [add_template,add_paragraph,send_button] = document.querySelectorAll('#create-add-comment, .add-paragraph, .add-paragraph');


/*
// data for the comment section
const names = {
    name_1: 'John cena',
    name_2: 'Micheal Jordan',
    name_3: 'Lebron James',
    name_4: 'Kobe Bryant',
}

// ---------------------------------  inside text for the comment section

const inside_texts = {
    text_1: 'hi how are you i heard you were working on a project and i wanted to know how it was going',
    text_2: 'hey i am good, i am working on a project and it is going well',
    text_3: 'that great let me know if you need any help ill be happy to help you',
    text_4: 'thanks i will let you know if i need any help you are my best frend abdul',
}

// ---------------------------------  image source for the comment section
const img_src = {
    img_1: 'images/avatars/image-amyrobson.png',
    img_2: 'images/avatars/image-juliusomo.png',
    img_3: 'images/avatars/image-maxblagun.png',
    img_4: 'images/avatars/image-ramsesmiron.png',
}

*/







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
     
    }
    add_section();
  });




// create the comment section


function createcommentsection (comment) {
    const {user, content, createdAt} = comment;
    const comment_template = list_template.content.cloneNode(true).firstElementChild;
    const [heading, time_at, inside_text] = comment_template.querySelectorAll('.heading,.time, .text-comment');
    const img = comment_template.querySelector('.img');
    if (heading && inside_text && img && time_at) {
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
  


    function add_section() {
        const add_template_section = add_template.content.cloneNode(true).firstElementChild;
        unorder_list.appendChild(add_template_section);
    }
    
   


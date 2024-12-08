const [list_template, main_section, unorder_list] = document.querySelectorAll('#list-template, #Interactive-comments-section, #unorder-list');
const [reply_templates_section,replay_paragraph,reply_name_tag ] = document.querySelectorAll('#reply-template,  .reply-paragraph, .reply-name');


const names = {
    name_1: 'John cena',
    name_2: 'Micheal Jordan',
    name_3: 'Lebron James',
    name_4: 'Kobe Bryant',
}

const inside_texts = {
    text_1: 'hi how are you i heard you were working on a project and i wanted to know how it was going',
    text_2: 'hey i am good, i am working on a project and it is going well',
    text_3: 'that great let me know if you need any help ill be happy to help you',
    text_4: 'thanks i will let you know if i need any help you are my best frend abdul',
}

const img_src = {
    img_1: 'images/avatars/image-amyrobson.png',
    img_2: 'images/avatars/image-juliusomo.png',
    img_3: 'images/avatars/image-maxblagun.png',
    img_4: 'images/avatars/image-ramsesmiron.png',
}


function createcommentsection (name, text, imgSrc) {
    const comment_template = list_template.content.cloneNode(true).firstElementChild;
    const [heading, inside_text] = comment_template.querySelectorAll('.heading, .text-comment');
    const img = comment_template.querySelector('.img');
    if (heading && inside_text && img) {
        heading.textContent = name;
        inside_text.textContent = text; // Corrected variable name
        img.src = imgSrc;
    }
    
    
    return comment_template;
}

function testthe_template() {
    const nameKeys = Object.keys(names);
    const textKeys = Object.keys(inside_texts);
    const imgKeys = Object.keys(img_src);

    for (let i = 0; i < nameKeys.length; i++) {
        const comment_section = createcommentsection(names[nameKeys[i]], inside_texts[textKeys[i]], img_src[imgKeys[i]]);
        unorder_list.appendChild(comment_section);
    }
}

testthe_template();
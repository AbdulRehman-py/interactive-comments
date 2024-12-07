const [list_template, main_section, unorder_list] = document.querySelectorAll('#list-template #Interactive-comments-section #unorder-list')


const pargraph = para({
    p1: "hi i have just completed my comment section project using html css and javascript",
    p2: "I have used the concept of template literals to create the template for the comments",
    p3: "Im tryingh a approcah from tutorial i havent even completed it yet so im a bit nervous",
    p4: "I have used the concept of template literals to create the template for the comments",
})

function createcommentsection () {
    const comment_template = list_template.content.cloneNode(true).firstElementChild;
}
// when green box is clicked
const box_green = {
    color: 'green',
    position: 1,
    clickMe: function() {
        document.querySelector('.green').addEventListener('click', () => {
            var str = `This is box number ${this.position} and it is ${this.color}.`;
            alert(str);
        });
    }
}
box_green.clickMe();

// when blue box is clicked
const box_blue = {
    color: 'blue',
    position: 2,
    // when clicked, change all 3 boxes to blue
    clickMe: function() {
        document.querySelector('.blue').addEventListener('click', () =>{
            const boxes = document.querySelectorAll('.box');
            // .from function changes the boxes type to array[]
            Array.from(boxes).forEach(curBox => curBox.style.backgroundColor = 'blue');

            // a loop to traverse all 3 boxes
            for (const curBox of Array.from(boxes)) {
                if(curBox.className === 'box blue') {
                    continue;
                }
                curBox.textContent = 'oh, I\'m blue...';
            }
        });
    }
}
box_blue.clickMe();

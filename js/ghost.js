class Ghost {
    constructor(className, startIndex) {
        this.className = className;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
        this.isScared = false;   
        this.timer = NaN;
    }

    get getIndex() {
        return this.currentIndex;
    }

    set setIndex(index) {
        this.currentIndex = index;
    }

    moveGhost(squares) {

        let ints = [-28, -1, 1, 28];
        //pick a random direction to move
        let randIndex = Math.floor(Math.random() * ints.length)
        let direction = ints[randIndex];

        //remove that direction from the array
        ints.splice(randIndex, 1);

        //make sure the ghost can move in that direction
        while (squares[this.getIndex + direction].classList.contains('wall') ||
            squares[this.getIndex + direction].classList.contains('ghost')) {

            //make sure there's a direction left to try
            if (ints.length){
                randIndex = Math.floor(Math.random() * ints.length)
                direction = ints[randIndex];
                //remove that direction from the array
                ints.splice(randIndex, 1);
            }

            //every direction is blocked, don't move
            else {
                direction = 0;
                break;
            }
        }
        
        if (this.isScared) {
            squares[this.getIndex].classList.remove('scared');
        }
        squares[this.getIndex].classList.remove('ghost');
        squares[this.getIndex].classList.remove(this.className);
        this.setIndex = this.getIndex + direction;
        squares[this.getIndex].classList.add(this.className);
        squares[this.getIndex].classList.add('ghost');
        if (this.isScared) {
            squares[this.getIndex].classList.add('scared');
        }
        
    }
}
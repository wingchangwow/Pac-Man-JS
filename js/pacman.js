class Pacman {
    constructor (index) {
        this.startingIndex = index;
        this.currentIndex = index;
        this.direction = 0;
    };

    get getIndex() {
        return this.currentIndex;
    };

    set setIndex(index) {
        this.currentIndex = index;
    }

    move(squares) {
        let index = this.getIndex + this.direction;
        
        //handle warping from one side to the other when using the shortcut
        if (index === 363) {
            index = 391;
        }
        else if (index === 392){
            index = 364;
        }
        
        //if pacman can move to the next square, do it
        if (!squares[index].classList.contains('wall') && 
            !squares[index].classList.contains('ghost-door')){

            squares[this.getIndex].classList.remove('pacman');
            this.setIndex = index;
            squares[this.getIndex].classList.add('pacman');
        }
        //if not, stop moving
        else {
            this.direction = 0;
        }
    }
}
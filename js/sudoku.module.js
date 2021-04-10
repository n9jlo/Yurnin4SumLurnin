export class Constraint {
  constructor() {
    this.members = [];
  }
  add(member) {
    this.members.push(member);
    member.listeners.push(this);
  }
  update(caller) {
    if( caller.domainSize() == 1) {
      var removeMe = caller.getDomain()[0];
      console.log(this.members);
      this.members.forEach(cell => {if(cell != caller) {cell.domainRemove(removeMe);}});
    }
  }
}

export class SudokuCell {
  constructor(degree=9) {
    this.degree = degree;
    this.domain = {};
    for (var i = 1; i <= this.degree; i++) {
      this.domain[i] = 1; 
    }
    this.listeners = [];
    this.domElement = null;
    this.cellElems = [];
  }

  set(val) {
    for( var key in this.domain) {
      if (key != val) {
        this.domainRemove(key);
      }
    }
  }

  getDomain() {
    return Object.keys(this.domain);
  }

  domainSize() {
    return Object.keys(this.domain).length;
  }

  domainRemove(i) {
    var retVal = false;
    if ( this.domainSize() > 1) {
      retVal = delete this.domain[i];
    }
    if (retVal) {
      this.cellElems.forEach(cell => cell.update());
      this.listeners.forEach(lstnr => lstnr.update(this));
    }
    if (this.domainSize() == 1) {
      // Switch to BIG mode.
      this.bigDiv.style = "display:block;";
      this.bigDiv.innerText = "" + Object.keys(this.domain)[0];
      this.littleDiv.style = "display:none;";
    }
    console.log("End of domain remove and and domain size is: " + this.domainSize());
    return retVal;
  }

  littleMode() {
    this.bigDiv.style = "display:none;";
    this.littleDiv.style = "display:block;";
  }

  domainAdd(i) {
    this.domain[i] = 1;
  }

  attach(parentElement) {
    var pe = parentElement;
    var doc = parentElement.getRootNode();

    var od = doc.createElement("div");
    pe.appendChild(od);

    this.bigDiv = document.createElement("div");
    this.bigDiv.setAttribute("class", "s1 s2");
    od.appendChild(this.bigDiv);
    this.bigDiv.style= "display:none;";
    this.bigDiv.sudokuCell = this;
    this.bigDiv.onclick = function() {this.sudokuCell.littleMode();};

    this.littleDiv = document.createElement("div");
    this.littleDiv.setAttribute("class", "s1");
    this.littleDiv.style= "display:block;";
    od.appendChild(this.littleDiv);

    var table = document.createElement("table");
    table.setAttribute("class", "s3");
    this.littleDiv.appendChild(table);

    var tbody = table.createTBody();

    const textAlign = ["left", "center", "right"];
    const vertAlign = ["top", "middle", "bottom"];

    for( var row = 0; row < 3; row++ ) {
      var rowElem = tbody.insertRow();
      for( var col = 0; col < 3; col++ ) {
        var cellElem = rowElem.insertCell();
        cellElem.setAttribute("class", "s0");
        cellElem.style = "opacity: 100%; text-align: " + textAlign[col] + ";vertical-align: " + vertAlign[row] + ";";
        cellElem.sudokuNumber = (((2-row)*3) + (col+1));
        cellElem.innerText = "" + cellElem.sudokuNumber;
        cellElem.sudokuCell = this;
        this.cellElems.push(cellElem)
        cellElem.update = function() {
          if (this.sudokuCell.domain[this.sudokuNumber] != undefined) {
            this.style.opacity = "100%";
          } else {
            this.style.opacity = "10%";
          }
        }
        cellElem.onclick = function() {
          if (this.style.opacity == "1") {
            if( this.sudokuCell.domainRemove(this.sudokuNumber)) {
            }
          } else {
            this.sudokuCell.domainAdd(this.sudokuNumber);
          }
        }
      }
    }
  }
}

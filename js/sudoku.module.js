export class SudokuCell {
  constructor(degree=9) {
    this.degree = degree;
    this.domain = {};
    for (var i = 1; i <= this.degree; i++) {
      this.domain[i] = 1; 
    }
    this.listeners = [];
    this.domElement = null;
  }

  domainSize() {
    return Object.keys(this.domain).length;
  }

  domainRemove(i) {
    var retVal = false;
    if ( this.domainSize() > 1) {
      retVal = delete this.domain[i];
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
        cellElem.sudokuNumber = (((2-row)*3) + (3-col));
        cellElem.innerText = "" + cellElem.sudokuNumber;
        cellElem.sudokuCell = this;
        cellElem.onclick = function() {
          if (this.style.opacity == "1") {
            if( this.sudokuCell.domainRemove(this.sudokuNumber)) {
              this.style.opacity = "10%";
            }
          } else {
            this.style.opacity = "100%";
            this.sudokuCell.domainAdd(this.sudokuNumber);
          }
          console.log(this.sudokuCell.domain);
        }
      }
    }
  }
}

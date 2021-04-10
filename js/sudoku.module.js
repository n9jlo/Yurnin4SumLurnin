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

  domainRemove(i) {
    delete this.domain[i];
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
    this.bigDiv.style.display = "none";

    this.littleDiv = document.createElement("div");
    this.littleDiv.setAttribute("class", "s1");
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
            this.style.opacity = "10%";
            this.sudokuCell.domainRemove(this.sudokuNumber);
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

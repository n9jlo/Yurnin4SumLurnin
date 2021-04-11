class Constraint {
  constructor() {
    this.members = [];
  }
  add(member) {
    this.members.push(member);
    member.listeners.push(this);
  }
  update(caller) {
    if (caller.domainSize() == 1) {
      var removeMe = caller.getDomain()[0];
      this.members.forEach(cell => { if (cell != caller) { cell.domainRemove(removeMe); } });
      return;
    }
    // Recompute aggregate domain.
    this.allDomains = {};
    for (var i=0;i<this.members.length;i++) {
      var cell = this.members[i];
      var domain = cell.getDomain();
      for (var j=0;j<domain.length;j++) {
        var dVal = domain[j];
        if( this.allDomains[dVal] == undefined ) {
          this.allDomains[dVal] = [];
        }
        this.allDomains[dVal].push(cell);
      }
    }
    //console.log(allDomains);
    // Aggregate domain analysis.
    var dKeys = Object.keys(this.allDomains);
    for (var i=0; i < dKeys.length; i++) {
      var dVal = dKeys[i];
      if (this.allDomains[dVal].length == 1) {
        // Unique within the constrained domain.
        var cell = this.allDomains[dVal][0];
        //cell.set(dVal);
        if (cell.domainSize() > 1) {
          console.log("dVal:" + dVal + " is unique on cell:" + cell.name + " who has domain:" + cell.getDomain() + " because aggregate domain was:" + Object.keys(this.allDomains));
          //cell.set(dVal);
        }
      }
    }
  }
}

export class SudokuPuzzle {
  constructor(insertHere) {
    this.insertHere = insertHere;

    var table = document.createElement("table");
    table.setAttribute("style", "border-collapse:collapse");
    insertHere.appendChild(table);
    var tbody = table.createTBody();
    var outArr = [[], [], [], [], [], [], [], [], []];
    for (var row = 0; row < 3; row++) {
      var rowElem = tbody.insertRow();
      for (var col = 0; col < 3; col++) {
        var cellElem = rowElem.insertCell();
        cellElem.setAttribute("class", "s4");
        var arr = this.makeBlock(cellElem);
        outArr[(3 * row)].push(arr[0][0]);
        outArr[(3 * row)].push(arr[0][1]);
        outArr[(3 * row)].push(arr[0][2]);
        outArr[(3 * row + 1)].push(arr[1][0]);
        outArr[(3 * row + 1)].push(arr[1][1]);
        outArr[(3 * row + 1)].push(arr[1][2]);
        outArr[(3 * row + 2)].push(arr[2][0]);
        outArr[(3 * row + 2)].push(arr[2][1]);
        outArr[(3 * row + 2)].push(arr[2][2]);
      }
    }
    var colConstraint = [];
    for (var row = 0; row < outArr.length; row++) {
      var rowConstraint = new Constraint();
      for (var col = 0; col < outArr[row].length; col++) {
        if (colConstraint[col] == undefined) {
          colConstraint[col] = new Constraint();
        }
        colConstraint[col].add(outArr[row][col]);
        rowConstraint.add(outArr[row][col]);
        outArr[row][col].name = ""+row+","+col;
      }
    }
    this.outArr = outArr;
  }

  makeBlock(insertHere) {
    var blockConstraint = new Constraint();
    var outArr = [[], [], []];
    var table = document.createElement("table");
    table.setAttribute("style", "border-collapse:collapse");
    insertHere.appendChild(table);
    var tbody = table.createTBody();
    for (var row = 0; row < 3; row++) {
      var rowElem = tbody.insertRow();
      for (var col = 0; col < 3; col++) {
        var cellElem = rowElem.insertCell();
        cellElem.setAttribute("class", "s4");
        var testCell = new SudokuCell();
        testCell.attach(cellElem);
        blockConstraint.add(testCell);
        outArr[row].push(testCell);
      }
    }
    return outArr;
  }

  init(puzzle) {
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        var char = puzzle[x].charAt(y);
        if (char != " ") {
          this.outArr[x][y].set(char);
        }
      }
    }
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        this.outArr[x][y].auto = false;
      }
    }
  }
}

class SudokuCell {
  constructor(degree = 9) {
    this.degree = degree;
    this.domain = {};
    this.auto = true;
    for (var i = 1; i <= this.degree; i++) {
      this.domain[i] = 1;
    }
    this.listeners = [];
    this.domElement = null;
    this.cellElems = [];
  }

  set(val) {
    for (var key in this.domain) {
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
    if (this.domainSize() > 1) {
      retVal = delete this.domain[i];
    }
    if (retVal) {
      this.cellElems.forEach(cell => cell.update());
      if( this.auto ) {
        this.listeners.forEach(lstnr => lstnr.update(this));
      }
    }
    if (this.domainSize() == 1) {
      // Switch to BIG mode.
      this.bigDiv.style = "display:block;";
      this.bigDiv.innerText = "" + Object.keys(this.domain)[0];
      this.littleDiv.style = "display:none;";
    }
    return retVal;
  }

  littleMode() {
    this.bigDiv.style = "display:none;";
    this.littleDiv.style = "display:block;";
  }

  domainAdd(i) {
    this.domain[i] = 1;
    this.cellElems.forEach(cell => cell.update());
    this.listeners.forEach(lstnr => lstnr.update(this));
  }

  attach(parentElement) {
    var pe = parentElement;
    var doc = parentElement.getRootNode();

    var od = doc.createElement("div");
    pe.appendChild(od);

    this.bigDiv = document.createElement("div");
    this.bigDiv.setAttribute("class", "s1 s2");
    od.appendChild(this.bigDiv);
    this.bigDiv.style = "display:none;";
    this.bigDiv.sudokuCell = this;
    this.bigDiv.onclick = function () { this.sudokuCell.littleMode(); };

    this.littleDiv = document.createElement("div");
    this.littleDiv.setAttribute("class", "s1");
    this.littleDiv.style = "display:block;";
    od.appendChild(this.littleDiv);

    var table = document.createElement("table");
    table.setAttribute("class", "s3");
    this.littleDiv.appendChild(table);

    var tbody = table.createTBody();

    const textAlign = ["left", "center", "right"];
    const vertAlign = ["top", "middle", "bottom"];

    for (var row = 0; row < 3; row++) {
      var rowElem = tbody.insertRow();
      for (var col = 0; col < 3; col++) {
        var cellElem = rowElem.insertCell();
        cellElem.setAttribute("class", "s0");
        cellElem.style = "opacity: 100%; text-align: " + textAlign[col] + ";vertical-align: " + vertAlign[row] + ";";
        cellElem.sudokuNumber = (((2 - row) * 3) + (col + 1));
        cellElem.innerText = "" + cellElem.sudokuNumber;
        cellElem.sudokuCell = this;
        this.cellElems.push(cellElem)
        cellElem.update = function () {
          if (this.sudokuCell.domain[this.sudokuNumber] != undefined) {
            this.style.opacity = "100%";
          } else {
            this.style.opacity = "10%";
          }
        }
        cellElem.onclick = function () {
          if (this.style.opacity == "1") {
            if (this.sudokuCell.domainRemove(this.sudokuNumber)) {
            }
          } else {
            this.sudokuCell.domainAdd(this.sudokuNumber);
          }
        }
      }
    }
  }
}

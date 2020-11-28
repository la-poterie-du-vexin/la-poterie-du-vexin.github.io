// To compile:
// tsc  --target es2019 ./ts/boutique.ts --outDir ./js; sed -i 's/^import/\/\/import/' ./js/boutique.js
//import './globals';
const allMaterials = ["raku", "gres", "porcelaine"];
let filters = {};
function formatIdentifier(str) {
    for (let i = 0; i < 10; i++)
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-zA-Z0-9]+/, "-").replace(/\s+/, "-").replace(/\s+/, "-");
    return str.replace(/[^a-zA-Z0-9]+/, "-");
}
function arrayDifference(arr1, arr2) {
    return arr1.filter((val) => !arr2.includes(val));
}
// return true if a tag is enabled.
function isTagEnabled(name) {
    let noMaterialFilter = allMaterials.reduce((prev, cur) => { return prev && !filters[cur]; }, true);
    let noFilters = arrayDifference(Object.keys(filters), allMaterials).reduce((prev, cur) => { return prev && !filters[cur]; }, true);
    // console.log(noMaterialFilter, noFilters);
    const isMaterial = allMaterials.includes(name);
    if (isMaterial && noMaterialFilter)
        return true;
    else if (!isMaterial && noFilters)
        return true;
    if (filters[name] === undefined)
        return false;
    return filters[name] === true;
}
var hiddenbox = document.createElement('div');
function isVisible(elt) {
    let classes = elt.className.split(" ");
    // check material.
    let material = allMaterials.find(m => classes.includes(m));
    if (!material)
        return false;
    if (material && !isTagEnabled(material))
        return false;
    // get tags.
    let tags = arrayDifference(classes, ["piece", "box", material]);
    let visible = false;
    for (let k of tags)
        visible = visible || isTagEnabled(k);
    return visible;
}
function render() {
    // console.log(allTags.flatMap(k => [k, isTagEnabled(k)]));
    let elements = document.getElementsByClassName("piece");
    Array.prototype.forEach.call(elements, elt => {
        // if (!isVisible(elt))
        // hiddenbox.appendChild(elt);
        elt.style.display = isVisible(elt) ? "block" : "none";
        // elt.style.visibility = isVisible(elt) ? "visible" : "collapse";
    });
    refreshTagCounts();
}
function setBoutiqueFilter(str, enabled) {
    filters[str] = enabled;
    // console.log(str, enabled);
    render();
}
function refreshTagCounts() {
    let list = document.getElementById("boutique_list");
    allTags.map(formatIdentifier).forEach(tag => {
        let elt = document.getElementById(`tagCount${tag}`);
        if (!elt)
            console.log("err", tag);
        if (!elt)
            return;
        let count = Array.prototype.filter.call(list.getElementsByClassName(tag), elt => elt.style.display !== "none").length;
        elt.innerHTML = `(${count})`;
    });
}
function createFilterBoxes() {
    let list = document.getElementById("boutique_list");
    function render(tag) {
        let formatedTag = formatIdentifier(tag);
        let count = document.getElementsByClassName(formatedTag).length;
        if (!count)
            return "";
        return `
    <li class="form-check">
    <input  onchange="setBoutiqueFilter('${formatedTag}', this.checked)"  class="form-check-input" type="checkbox" value="" id="checkboxFilter${tag}">
    <label class="form-check-label" for="checkboxFilter${tag}">
      ${tag} <span id="tagCount${formatedTag}">(${count})
    </label>
  </li>`;
    }
    const setHtml = (id, html) => {
        let elt = document.getElementById(id);
        if (elt)
            elt.innerHTML = html;
    };
    setHtml('boutiqueTagFilters', allTags.map(render).join("\n"));
    setHtml('boutiqueMaterialFilters', ["raku", "grès", "porcelaine"].map(render).join("\n"));
}
function shuffleBoutiqueList() {
    let list = document.getElementById("boutique_list");
    for (var i = list.children.length; i >= 0; i--) {
        list.appendChild(list.children[Math.random() * i | 0]);
    }
}
createFilterBoxes();
shuffleBoutiqueList();
function toggleDisplayBlock(elt_) {
    let elt = elt_;
    if (!elt.classList)
        elt = document.getElementById(elt_);
    if (elt.style.display !== "block")
        elt.style.display = 'block';
    else
        elt.style.display = 'none';
}

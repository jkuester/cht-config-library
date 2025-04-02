/* global document */

const createSelectHtml = (id) => `
<select name="pets" id="${id}">
  <option value="">--Please choose an option--</option>
  <option value="dog">Dog</option>
  <option value="cat">Cat</option>
  <option value="hamster">Hamster</option>
  <option value="parrot">Parrot</option>
  <option value="spider">Spider</option>
  <option value="goldfish">Goldfish</option>
</select>
`;

const getSelectElement = key => document.querySelector(`#${key.replace(/\//g, '\\/')}`);

module.exports = function(elementName) {
  const key = `${elementName.v}-extended`;
  const input = document.querySelector(`input[type="text"][name="${elementName.v}"]`);
  if (getSelectElement(key)) {
    return {
      t: 'str',
      v: input.value
    };
  }

  input.style.display = 'none';

  input.insertAdjacentHTML('afterend', createSelectHtml(key));
  const select = getSelectElement(key);
  select.addEventListener('change', (e) => {
    input.value = e.target.value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  return {
    t: 'str',
    v: ''
  };
};

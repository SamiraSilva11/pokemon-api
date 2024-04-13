document.querySelector('#poke1').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    let pokeId = document.querySelector('#poke1').value;
    getFetch(pokeId);
    
  }
});

document.querySelector('#previous').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  let pokeId = parseInt(document.querySelector('.prevId').innerText); // Get the previous ID
  console.log(pokeId);
  getFetch(pokeId); // Call getFetch with the previous ID
});

document.querySelector('#next').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  let pokeId = parseInt(document.querySelector('.nextId').innerText); // Get the next ID
  console.log(pokeId);
  getFetch(pokeId); // Call getFetch with the next ID
});


function getFetch(pokeId) {
  const url = 'https://pokeapi.co/api/v2/pokemon/' + pokeId;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const pokeImg = data.sprites.other["official-artwork"].front_default;
      const id = data.id;
      const name = data.name;
      const height = data.height;
      const weight = data.weight;
      const abilities = data.abilities.map(ability => ability.ability.name); // Map to extract all abilities
      const types = data.types.map(type => type.type.name);
      const prevId = id === 1 ? 1025 : id - 1;
      const nextId = id === 1025? 1 : id + 1;
      const hp = data.stats[0].base_stat;
      const atk = data.stats[1].base_stat;
      const def = data.stats[2].base_stat;
      const sp_atk = data.stats[3].base_stat;
      const sp_def = data.stats[4].base_stat;
      const speed = data.stats[5].base_stat;


      console.log(data);

      // Fetch the names for prevId and nextId
      Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${prevId}`).then(res => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}`).then(res => res.json())
      ])
        .then(names => {
          const prevName = names[0].name;
          const nextName = names[1].name;

          // Update UI with fetched data
          document.getElementById('pokeImg1').style.display = 'inline';
          document.getElementById('pokeImg1').src = pokeImg;
          document.querySelector('.prevId').innerText = padZeros(prevId);
          document.querySelector('.nextId').innerText = padZeros(nextId);
          document.querySelector('.prevName').innerText = capitalize(prevName);
          document.querySelector('.nextName').innerText = capitalize(nextName);
          document.querySelector('#hp').innerText = hp;
          document.querySelector('#atk').innerText = atk;
          document.querySelector('#def').innerText = def;
          document.querySelector('#sp-atk').innerText = sp_atk;
          document.querySelector('#spc-def').innerText = sp_def;
          document.querySelector('#speed').innerText = speed;
          document.querySelector('#name').innerText = capitalize(name);
          document.querySelector('#id').innerText = padZeros(id);
          document.querySelector('#height').innerText = height;
          document.querySelector('#weight').innerText = weight;
          document.querySelector('#category').innerText = types; // Updated to third element
          document.querySelector('#abilities').innerText = abilities;

          // Update skill bars
          setSkillBarWidthAndAnimation('hp', hp);
          setSkillBarWidthAndAnimation('atk', atk);
          setSkillBarWidthAndAnimation('def', def);
          setSkillBarWidthAndAnimation('sp-atk', sp_atk);
          setSkillBarWidthAndAnimation('spc-def', sp_def);
          setSkillBarWidthAndAnimation('speed', speed);

        })
        .catch(err => {
          console.log(`Error fetching data: ${err}`);
        });
    })
    .catch(err => {
      console.log(`Error fetching data: ${err}`);
    });
}




function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function padZeros(id) {
  if (id < 10) {
    return "000" + id;
  } else if (id < 100) {
    return "00" + id;
  } else if (id < 1000) {
    return "0" + id;
  } else {
    return "" + id; // Return as string if 4 or more digits
  }
}


function setSkillBarWidthAndAnimation(skillName, value) {
  const skillBar = document.querySelector(`.${skillName}`);
  const widthValue = value / 2; // Assuming the value is out of 200
  skillBar.style.width = `${widthValue}%`;

  const keyframesAnimation = `
    @keyframes ${skillName}Animation {
      0% { width: 0%; }
      100% { width: ${widthValue}%; }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.innerHTML = keyframesAnimation;
  document.head.appendChild(styleElement);

  skillBar.style.animation = `${skillName}Animation 2s`;
}

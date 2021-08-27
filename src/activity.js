
module.exports = {get_random_activity}

function get_random_activity(){
    return random_element(activities)
}

function random_element(arr) {
    return arr[Math.floor((Math.random() * arr.length))]
}

const activities = [
    {type: 'PLAYING', name: 'as Sienna'},
    {type: 'PLAYING', name: 'as Markus'},
    {type: 'PLAYING', name: 'as Bardin'},
    {type: 'PLAYING', name: 'as the elf'},
    {type: 'PLAYING', name: 'as Victor'},
    {type: 'PLAYING', name: 'Spicy Onslaught'},
    {type: 'PLAYING', name: 'C3DWONS'},
    {type: 'PLAYING', name: 'Hyper-Twitch'},
    {type: 'PLAYING', name: 'Vermintide 1'},
    {type: 'PLAYING', name: 'Darktide'},
    {type: 'PLAYING', name: 'Age of Empires II'},
    {type: 'LISTENING', name: 'the crackle of Sienna\'s flames'},
    {type: 'LISTENING', name: 'Bardin\'s Singing'},
    {type: 'LISTENING', name: 'Vermintide Soundtrack'},
    {type: 'WATCHING', name: 'the Onslaught Series'},
    {type: 'COMPETING', name: 'the Onslaught Series'},
]

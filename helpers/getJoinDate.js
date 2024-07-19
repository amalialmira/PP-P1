function getJoinDate(value){
    const event = new Date(value);
    const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    };


    return event.toLocaleDateString('id-ID', options)
}

module.exports = getJoinDate
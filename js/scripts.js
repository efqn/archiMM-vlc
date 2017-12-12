function changeLink(videoLink) {
            var link = document.getElementById('U2BE');
            var value = link.getAttribute('src'); // On récupère l'attribut « value »

            //link.setAttribute('src', videoLink);  // On édite l'attribut « value »
            $.('#U2BE').prop('src',videoLink);
}
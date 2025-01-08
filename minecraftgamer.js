
(function() {
    'use strict';
    if (localStorage.clientcolor == undefined) {
      localStorage.clientcolor = `#b069db`
    }
    if (localStorage.clientcoloralt == undefined) {
      localStorage.clientcoloralt = `#000`
    }
    if (window.location.pathname == "/") {

      if (window.location.pathname == "/") {
        document.getElementsByClassName(`textcentered community changelog-new`)[0].innerHTML = `\n              <a href="https://open.spotify.com/user/gilpom/playlist/47N9rRbMXezlPXvhqVM3lJ?si=6bHzE9A9S-2TGh7C4OndkA" target="_blank" style="color: rgb(255, 255, 255);"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.56-8-8-8zm3.68 11.56c-.16.24-.44.32-.68.16-1.88-1.16-4.24-1.4-7.04-.76-.28.08-.52-.12-.6-.36-.08-.28.12-.52.36-.6 3.04-.68 5.68-.4 7.76.88.28.12.32.44.2.68zm.96-2.2c-.2.28-.56.4-.84.2-2.16-1.32-5.44-1.72-7.96-.92-.32.08-.68-.08-.76-.4-.08-.32.08-.68.4-.76 2.92-.88 6.52-.44 9 1.08.24.12.36.52.16.8zm.08-2.24C10.16 5.6 5.88 5.44 3.44 6.2c-.4.12-.8-.12-.92-.48-.12-.4.12-.8.48-.92 2.84-.84 7.52-.68 10.48 1.08.36.2.48.68.28 1.04-.2.28-.68.4-1.04.2z" fill-rule="nonzero"></path></svg><br>Spotify</a>\n              <a href="https://www.deezer.com/playlist/5343057502" target="_blank" style="color: rgb(255, 255, 255);"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M9.812 12.464h2.917v-.884H9.81v.884zm-6.54 0h2.916v-.884H3.27v.884zm-3.272 0h2.917v-.884H0v.884zm6.54 0h2.92v-.884H6.54v.884zm6.543 0H16v-.884h-2.917v.884zm0-1.15H16v-.883h-2.917v.89zm-6.542 0h2.92v-.883H6.54v.89zm-6.54 0h2.92v-.883H0v.89zm3.27 0h2.92v-.883H3.27v.89zm6.55 0h2.92v-.883H9.81v.89zm0-1.148h2.92v-.884H9.81v.884zm-6.54 0h2.91v-.884H3.27v.884zm-3.27 0h2.91v-.884H0v.884zm6.54 0h2.92v-.884H6.54v.884zm6.55 0H16v-.884h-2.917v.884zm0-1.15H16v-.883h-2.917v.884zm-6.54 0h2.91v-.883H6.54v.884zm-6.54 0h2.91v-.883H0v.884zm9.82 0h2.92v-.883H9.81v.884zm0-1.15h2.92v-.882H9.81v.883zm-9.82 0h2.91v-.88H0v.882zm6.54 0h2.92v-.88H6.54v.882zm6.54 0H16v-.882h-2.917v.884zM6.54 6.72h2.92v-.885H6.54v.884zm6.543-.002H16v-.883h-2.917v.883zM6.54 5.57h2.92v-.885H6.54v.885zm6.543 0H16v-.885h-2.917v.884zm0-1.15H16v-.884h-2.917v.884z"></path></svg><br>Deezer</a>\n            <a href="https://starblast.dankdmitron.dev/" target="_blank" style="color: rgb(255, 255, 255);"><i class='sbg sbg-fly-full'></i><br>SL+</a>\n            <a href="https://starblast-shipyard.github.io/" target="_blank" style="color: rgb(255, 255, 255);"><i class='sbg sbg-fly-full'></i><br>Shipyard</a>\n            <a href="https://starblast.io/modding.html" target="_blank" style="color: rgb(255, 255, 255);"><i class='sbg sbg-modding'></i><br>Modding Space</a>\n            <a href="https://starblast.io/shipeditor/" target="_blank" style="color: rgb(255, 255, 255);"><i class='sbg sbg-fly'></i><br>Ship Editor</a>\n     <a href="https://discord.gg/z3C458DMD8" target="_blank" style="color: rgb(255, 255, 255);"><i class='sbg sbg-discord'></i><br>FV Discord</a>\n         `
      }
      class FVclient{
        help(){
                  }
        color(colornum,colorhex){
          if (colornum == undefined) {
            console.log(`%c 1) Color 1 \n 2) Color 2 `, `background: #000; color: #b069db`);
            return
          }
          if (colorhex == undefined) {
            console.log(`%c [!] You must specify a color hex [!] `, `background: #000; color: #8934C2`);
            return
          }
          if (colornum == 1) {
            console.log(`%c [!] Color 1 set to ${colorhex} [!] `, `background: #000; color: #b069db`);
            localStorage.clientcolor = colorhex
          }else{
            console.log(`%c [!] Color 2 set to ${colorhex} [!] `, `background: #000; color: #b069db`);
            localStorage.clientcoloralt = colorhex
          }
        }
      }
      var ac = new FVclient()
      window.ac = new FVclient()
      ac.help()

      function themeclient() {
        if (document.getElementsByClassName(`top-right`)[0]) {
          //AOW
          /*document.getElementsByClassName(`alphacentauri`)[1].style.boxShadow = `0px 0px 6px #b069db`
          document.getElementsByClassName(`alphacentauri`)[1].children[0].style.boxShadow = `0px 0px 6px #b069db`
          document.getElementsByClassName(`alphacentauri`)[1].children[1].style.color = `#fff`
          document.getElementsByClassName(`alphacentauri`)[1].children[3].style.color = `#fff`
          document.getElementsByClassName(`top-right`)[0].children[2].style.borderBottom = `3px solid #b069db`
          document.getElementsByClassName(`top-right`)[0].children[2].children[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName(`top-right`)[0].children[2].children[0].style.boxShadow = `0 0 6px #b069db`
          document.getElementsByClassName(`top-right`)[0].children[2].children[0].style.textShadow = `0 0 7px #b069db`*/
        }

        if (document.getElementById("play").style.color != `#fff`) {

        const changelogDivs = document.getElementsByClassName('textcentered community changelog-new');
      Array.from(changelogDivs).forEach(div => {
        div.style.color = '#fff';
        div.style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
        div.style.boxShadow = '0 0 7px #b069db';
        div.style.textShadow = '0 0 7px #b069db';
});

// Style social media icons correctly using getElementsByClassName
if (document.getElementsByClassName("fa-twitter")[0]) {
    document.getElementsByClassName("fa-twitter")[0].style.color = '#fff';
    document.getElementsByClassName("fa-twitter")[0].style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
    document.getElementsByClassName("fa-twitter")[0].style.boxShadow = '0 0 7px #b069db';
    document.getElementsByClassName("fa-twitter")[0].style.textShadow = '0 0 7px #b069db';
}

if (document.getElementsByClassName("fa-facebook")[0]) {
    document.getElementsByClassName("fa-facebook")[0].style.color = '#fff';
    document.getElementsByClassName("fa-facebook")[0].style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
    document.getElementsByClassName("fa-facebook")[0].style.boxShadow = '0 0 7px #b069db';
    document.getElementsByClassName("fa-facebook")[0].style.textShadow = '0 0 7px #b069db';
}

if (document.getElementsByClassName("fa-vk")[0]) {
    document.getElementsByClassName("fa-vk")[0].style.color = '#fff';
    document.getElementsByClassName("fa-vk")[0].style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
    document.getElementsByClassName("fa-vk")[0].style.boxShadow = '0 0 7px #b069db';
    document.getElementsByClassName("fa-vk")[0].style.textShadow = '0 0 7px #b069db';
}

if (document.getElementsByClassName("fa-envelope")[0]) {
    document.getElementsByClassName("fa-envelope")[0].style.color = '#fff';
    document.getElementsByClassName("fa-envelope")[0].style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
    document.getElementsByClassName("fa-envelope")[0].style.boxShadow = '0 0 7px #b069db';
    document.getElementsByClassName("fa-envelope")[0].style.textShadow = '0 0 7px #b069db';
}

// Style the continue, respawn, and refresh buttons
const buttonIds = ['continue_btn', 'respawn_btn', 'refresh_btn'];
buttonIds.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
        button.style.color = '#fff';
        button.style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
        button.style.boxShadow = '0 0 7px #b069db';
        button.style.textShadow = '0 0 7px #b069db';
    }
});

// Style the social media icons
const socialIcons = document.querySelectorAll('.fa-facebook, .fa-twitter, .fa-vk');
socialIcons.forEach(icon => {
    icon.style.color = '#fff';
    icon.style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
    icon.style.boxShadow = '0 0 7px #b069db';
    icon.style.textShadow = '0 0 7px #b069db';
});

// Select all elements with class 'stats'
const statsElements = document.getElementsByClassName('stats');
Array.from(statsElements).forEach(statsDiv => {
    // Apply the gradient background and other styling
    statsDiv.style.background = 'linear-gradient(-45deg, hsla(306, 100%, 50%, 0.5) 0, hsla(200, 50%, 50%, 0.15) 100%)';
    statsDiv.style.color = '#fff';
    statsDiv.style.boxShadow = '0 0 7px #b069db';
    statsDiv.style.textShadow = '0 0 7px #b069db';

    // Style the child elements (statinfo)
    const statInfoDivs = statsDiv.getElementsByClassName('statinfo');
    Array.from(statInfoDivs).forEach(statInfo => {
        statInfo.style.color = '#fff';
        statInfo.style.textShadow = '0 0 7px #b069db';
    });
});

          // Apply styles to the community-links div
    const communityLinksDiv = document.querySelector('.textcentered.community.changelog-new');
    communityLinksDiv.style.color = '#fff';
    communityLinksDiv.style.background = 'linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)';
    communityLinksDiv.style.boxShadow = '0 0 7px #b069db';
    communityLinksDiv.style.textShadow = '0 0 7px #b069db';

        // Apply styles to the changelog div
    const changelogDiv = document.querySelector('.changelog-new');
    changelogDiv.style.color = '#fff';
    changelogDiv.style.background = 'linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)';
    changelogDiv.style.boxShadow = '0 0 7px #b069db';
    changelogDiv.style.textShadow = '0 0 7px #b069db';
          //play button
          document.getElementById("play").style.color = `#fff`
          document.getElementById("play").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("play").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("play").style.textShadow = `0 0 7px #b069db`
          //arrows
          document.getElementById(`nextMode`).style.color = `#b069db`
          document.getElementById(`nextMode`).style.textShadow = `0 0 7px #b069db`
          document.getElementById(`prevMode`).style.color = `#b069db`
          document.getElementById(`prevMode`).style.textShadow = `0 0 7px #b069db`
          //name box
          document.getElementsByClassName("inputwrapper")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("inputwrapper")[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          //modding space
          document.getElementById("moddingspace").style.color = `#fff`
          document.getElementById("moddingspace").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("moddingspace").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("moddingspace").style.textShadow = `0 0 7px #b069db`
          //ecp
          document.getElementById("donate").style.color = `#fff`
          document.getElementById("donate").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("donate").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("donate").style.textShadow = `0 0 7px #b069db`
          //leaderboard
          document.getElementById("rankings").style.color = `#fff`
          document.getElementById("rankings").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("rankings").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("rankings").style.textShadow = `0 0 7px #b069db`
          //training
          document.getElementById("training").style.color = `#fff`
          document.getElementById("training").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("training").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("training").style.textShadow = `0 0 7px #b069db`
          //twitter button
          document.getElementsByClassName("sbg-twitter")[1].style.color = `#fff`
          document.getElementsByClassName("sbg-twitter")[1].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("sbg-twitter")[1].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("sbg-twitter")[1].style.textShadow = `0 0 7px #b069db`
          //FB button
          document.getElementsByClassName("sbg-facebook")[1].style.color = `#fff`
          document.getElementsByClassName("sbg-facebook")[1].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("sbg-facebook")[1].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("sbg-facebook")[1].style.textShadow = `0 0 7px #b069db`
          //settings button
          document.getElementsByClassName("sbg-gears")[1].style.color = `#fff`
          document.getElementsByClassName("sbg-gears")[1].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("sbg-gears")[1].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("sbg-gears")[1].style.textShadow = `0 0 7px #b069db`
          //info button
          document.getElementsByClassName("sbg-info")[1].style.color = `#fff`
          document.getElementsByClassName("sbg-info")[1].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("sbg-info")[1].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("sbg-info")[1].style.textShadow = `0 0 7px #b069db`
          //changelog
          document.getElementsByClassName(`changelog-new`)[0].children[0].children[0].children[0].style.color = `#fff`
          document.getElementsByClassName(`changelog-new`)[0].children[1].style.color = `#fff`
          document.getElementsByClassName("changelog-new")[0].style.color = `#fff`
          document.getElementsByClassName("changelog-new")[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("changelog-new")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("changelog-new")[0].style.textShadow = `0 0 7px #b069db`
          //music
          document.getElementsByClassName("changelog-new")[2].style.color = `#fff`
          document.getElementsByClassName("changelog-new")[2].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("changelog-new")[2].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("changelog-new")[2].style.textShadow = `0 0 7px #b069db`
          document.getElementsByClassName(`community`)[0].children[0].style.color = `#fff`
          document.getElementsByClassName(`community`)[0].children[1].style.color = `#fff`
          //socials
          document.getElementsByClassName(`community`)[2].children[0].style.color = `#fff`
          document.getElementsByClassName(`community`)[2].children[1].style.color = `#fff`
          document.getElementsByClassName(`community`)[2].children[2].style.color = `#fff`
          document.getElementsByClassName(`community`)[2].children[3].style.color = `#fff`
          document.getElementsByClassName("changelog-new")[4].style.color = `#fff`
          document.getElementsByClassName("changelog-new")[4].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("changelog-new")[4].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("changelog-new")[4].style.textShadow = `0 0 7px #b069db`
          //menus
          document.getElementsByClassName("modal")[0].style.color = `#fff`
          document.getElementsByClassName("modal")[0].style.background = `linear-gradient(135deg,#b069db 0,${localStorage.clientcoloralt} 150%)`
          document.getElementsByClassName("modal")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("modal")[0].style.textShadow = `0 0 7px #b069db`
          //loading bar
          document.getElementsByClassName(`loaderprogress`)[0].style.background = `linear-gradient(to right,${localStorage.clientcoloralt} 0,#b069db 100%)`
          document.getElementsByClassName(`gameloaderwrapper`)[0].style.border = `2px solid #b069db`
          document.getElementsByClassName(`gameloaderwrapper`)[0].style.boxShadow = `0 0 10px #b069db`
          //text below loading bar
          document.getElementsByClassName(`textprogress`)[0].style.color = `#b069db`
          document.getElementsByClassName(`textprogress`)[0].style.textShadow = `0 0 10px #b069db`
          if (document.getElementsByClassName("donate-btn")[1]) {
            //custom game button
            document.getElementsByClassName("donate-btn")[1].style.color = `#fff`
            document.getElementsByClassName("donate-btn")[1].style.background = `radial-gradient(ellipse at center,${localStorage.clientcoloralt} 0,#b069db 150%)`
            document.getElementsByClassName("donate-btn")[1].style.boxShadow = `0 0 7px #b069db`
            document.getElementsByClassName("donate-btn")[1].style.textShadow = `0 0 7px #b069db`
            //ecp and ship preview
            for(let i = 0; i < document.getElementsByClassName("frozenbg").length; i++){
              document.getElementsByClassName("frozenbg")[i].style.background = `radial-gradient(ellipse at center,${localStorage.clientcoloralt} 20%,#b069db 150%)`
              document.getElementsByClassName("frozenbg")[i].style.boxShadow = `0 0 6px #b069db`
              document.getElementsByClassName("frozenbg")[i].style.textShadow = `0 0 7px #b069db`
            }
            //show ecp button
            document.getElementById("viewEcp").style.color = `#fff`
            document.getElementById("viewEcp").style.background = `radial-gradient(ellipse at center,${localStorage.clientcoloralt} 0,#b069db 150%)`
            document.getElementById("viewEcp").style.boxShadow = `0 0 7px #b069db`
            document.getElementById("viewEcp").style.textShadow = `0 0 7px #b069db`
            //ecp key box
            document.getElementById("ECPKey").style.color = `#fff`
            document.getElementById("ECPKey").style.background = `radial-gradient(ellipse at center,${localStorage.clientcoloralt} 0,#b069db 150%)`
            document.getElementById("ECPKey").style.boxShadow = `0 0 7px #b069db`
            document.getElementById("ECPKey").style.textShadow = `0 0 7px #b069db`
            //delete ecp button
            document.getElementById("removeEcp").style.color = `#fff`
            document.getElementById("removeEcp").style.background = `radial-gradient(ellipse at center,${localStorage.clientcoloralt} 0,#b069db 150%)`
            document.getElementById("removeEcp").style.boxShadow = `0 0 7px #b069db`
            document.getElementById("removeEcp").style.textShadow = `0 0 7px #b069db`
          }
        }
        if (document.getElementsByClassName("stats")[0].children.length > 0) {
          //continue button
          document.getElementById("continue_btn").style.color = `#fff`
          document.getElementById("continue_btn").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("continue_btn").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("continue_btn").style.textShadow = `0 0 7px #b069db`
          //death stats
          document.getElementsByClassName("stats")[0].style.border = `2px solid #b069db`
          document.getElementsByClassName("stats")[0].style.boxShadow = `0 0 15px #b069db`
          document.getElementsByClassName("stats")[0].style.background = `hsl(0deg 0% 100% / 0%)`
          //death stats separators
          for(let i = 0; i < document.getElementsByClassName("stats")[0].children.length; i++){
            document.getElementsByClassName("stats")[0].children[i].style.borderBottom = `1px solid #b069db`
          }
        }
 
        if (document.getElementsByClassName("fa-vk")[0] != undefined) {
          //link bar
          document.getElementsByClassName("stats")[0].children[3].style.color = `#fff`
          document.getElementsByClassName("stats")[0].children[3].style.background = `linear-gradient(to top,#b069db 0,${localStorage.clientcoloralt} 20%,${localStorage.clientcoloralt} 60%,#b069db 100%)`
          document.getElementsByClassName("stats")[0].children[3].style.border = `0 solid #b069db`
          document.getElementsByClassName("stats")[0].children[3].style.boxShadow = `0 0 6px #b069db`
          //respawn button
          document.getElementById("respawn_btn").style.color = `#fff`
          document.getElementById("respawn_btn").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("respawn_btn").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("respawn_btn").style.textShadow = `0 0 7px #b069db`
          //quit button
          document.getElementById("refresh_btn").style.color = `#fff`
          document.getElementById("refresh_btn").style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementById("refresh_btn").style.boxShadow = `0 0 7px #b069db`
          document.getElementById("refresh_btn").style.textShadow = `0 0 7px #b069db`
          //death stats
          document.getElementsByClassName("stats")[0].style.border = `2px solid #b069db`
          document.getElementsByClassName("stats")[0].style.boxShadow = `0 0 15px #b069db`
          document.getElementsByClassName("stats")[0].style.background = `hsl(0deg 0% 100% / 0%)`
          //death text
          document.getElementById("overlay").style.color = `#fff`
          //death twitter button
          document.getElementsByClassName("fa-twitter")[0].style.color = `#fff`
          document.getElementsByClassName("fa-twitter")[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("fa-twitter")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("fa-twitter")[0].style.textShadow = `0 0 7px #b069db`
          //death FB button
          document.getElementsByClassName("fa-facebook")[0].style.color = `#fff`
          document.getElementsByClassName("fa-facebook")[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("fa-facebook")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("fa-facebook")[0].style.textShadow = `0 0 7px #b069db`
          //death vk button
          document.getElementsByClassName("fa-vk")[0].style.color = `#fff`
          document.getElementsByClassName("fa-vk")[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("fa-vk")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("fa-vk")[0].style.textShadow = `0 0 7px #b069db`
          //death FB button
          document.getElementsByClassName("fa-envelope")[0].style.color = `#fff`
          document.getElementsByClassName("fa-envelope")[0].style.background = `linear-gradient(-45deg, hsl(306.06deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%)`
          document.getElementsByClassName("fa-envelope")[0].style.boxShadow = `0 0 7px #b069db`
          document.getElementsByClassName("fa-envelope")[0].style.textShadow = `0 0 7px #b069db`
          //death stats separators
          for(let i = 0; i < document.getElementsByClassName("stats")[0].children.length; i++){
            document.getElementsByClassName("stats")[0].children[i].style.borderBottom = `1px solid #b069db`
          }
        }
        setTimeout(themeclient, 500)
      }
      themeclient()
    }
})();

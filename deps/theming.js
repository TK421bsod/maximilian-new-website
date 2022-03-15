function getCookies(){
    for (const cookie of document.cookie.split(";")){
        let intermediate=cookie.split("=");
        cookies[intermediate[0]]=intermediate[1];
    }
}

function toggleTheme(){
    toggle = ! getCurrentTheme();
    initTheming();
}

function getCurrentTheme(){
    // true == dark theme, false == light theme
    try {
        return toggle
    } catch (error){
        console.log("toggled not set!") //toggled not set yet? check cookies
    }
    if (cookies['theme']){
        source = "cookie"
        console.log("cookie is set, setting theme to " + cookies['theme'])
        return cookies['theme'] == "dark" //no cookie set? check system theme
    }
    console.log("cookie not set!")
    source = "system"
    try {
        return window.matchMedia("(prefers-color-scheme:dark)").matches;
    } catch (error){
        //browser doesn't support this? default to dark theme
        return true
    }
}

function applyLightStyling(){
    console.log("switching to light theme")
    document.cookie = "theme=light"
    document.body.style.color = "#36393f"; document.body.style.backgroundColor = "white"; for (const each of document.getElementsByClassName('btn')){each.className = each.className.replace('btn-outline-light', 'btn-outline-dark')}; for (const each of document.getElementsByTagName('a')){each.className = each.className.replace('link-light', 'link-dark')}; document.getElementById('navbar').className = document.getElementById('navbar').className.replace("navbar-dark", "navbar-light"); document.getElementById('navbar').style.backgroundColor = "white";
}

function applyDarkStyling(){
    console.log("switching to dark theme")
    document.cookie = "theme=dark"
    document.body.style.color = "white"; document.body.style.backgroundColor = "#36393f"; for (const each of document.getElementsByClassName('btn')){each.className = each.className.replace('btn-outline-dark', 'btn-outline-light')}; for (const each of document.getElementsByTagName('a')){each.className = each.className.replace('link-dark', 'link-light')}; document.getElementById('navbar').className = document.getElementById('navbar').className.replace("navbar-light", "navbar-dark"); document.getElementById('navbar').style.backgroundColor = "#36393f"
}

function addCloseButton(name){
    try{
        if (added){
            return
        }
    } catch(error){
        added = true
    }
    console.log("adding close button")
    document.getElementById(name+'-close').style.transform = "scale(1, 1)";
    document.getElementById(name).style.width = "445px";
    added = true
}

function removeCloseButton(name){
    if (! added){
        return
    }
    console.log("removing close button")
    document.getElementById(name+'-close').style.transform = "scale(0.01, 0.01)";
    document.getElementById(name).style.width = "425px";
    added = false
}

function getNotifRef(name){
    return bootstrap.Toast.getOrCreateInstance(document.getElementById(name))
}

function hideNotif(name){
    if (held){
        console.log("Attempted to hide notif when it was held!")
        return
    }
    console.log("Hiding notif")
    document.getElementById(name).style.marginBottom = "1.5%";
    setTimeout(getNotifRef(name).hide(), 700);
}

function holdNotif(){
    if (held){
        console.log("Notif already held!")
        return //event handler may have gone off twice
    }
    console.log('Holding notif')
    clearTimeout(notifEndAnim);
    held = true
}

function releaseNotif(name){
    if (! held){
        return
    }
    console.log("Releasing notif, hiding after " + String(notifEndAnimDelay) + "ms")
    held = false;
    notifEndAnim = setTimeout(function(){hideNotif(name)}, notifEndAnimDelay);
}

function showNotif(name){
    console.log("Showing notif '" + name + "'")
    notifEndAnimDelay = 5400;
    let notifRef = getNotifRef(name);
    let notifElem = document.getElementById(name);
    if (! notifElem || ! notifRef){
        throw new Error('Invalid name passed to showNotif!')
    }
    //mouse events
    notifElem.addEventListener("mouseover", function(){addCloseButton(name)});
    notifElem.addEventListener("mouseover", holdNotif);
    notifElem.addEventListener("mouseout", function(){removeCloseButton(name)});
    notifElem.addEventListener("mouseout", function(){releaseNotif(name)});
    //focus events e.g tab key
    notifElem.addEventListener("focusin", function(){addCloseButton(name)});
    notifElem.addEventListener("focusin", holdNotif);
    notifElem.addEventListener("focusout", function(){removeCloseButton(name)});
    notifElem.addEventListener("focusout", function(){releaseNotif(name)});
    //touch events
    notifElem.addEventListener("touchstart", function(){addCloseButton(name)});
    notifElem.addEventListener("touchstart", holdNotif);
    notifElem.addEventListener("touchend", function(){removeCloseButton(name)});
    notifElem.addEventListener("touchend", function(){releaseNotif(name)});
    notifRef.show();
    setTimeout(function(){notifElem.style.marginBottom = "1%";}, 500);
}

function showThemeNotif(theme){
    console.log("Showing theme notif")
    notifEndAnimDelay = 5400
    held = false
    let themeNotif = document.getElementById("theme-notif")
    if (source == "system"){
        document.getElementById("theme-set").innerHTML = "Automatically enabled <b> " + theme + " theme</b> based on your system theme." + document.getElementById("theme-set").innerHTML;
    } else {
        document.getElementById("theme-set").style.fontSize = ".85rem";
        document.getElementById("theme-set").innerHTML = "Automatically enabled <b> " + theme + " theme</b> based on your previous session." + document.getElementById("theme-set").innerHTML;
    }
    showNotif('theme-notif');
    notifEndAnim = setTimeout(function(){hideNotif('theme-notif')}, notifEndAnimDelay);
}

function initTheming(){
    cookies = {};
    getCookies();
    console.log("initializing theming")
    let theme = getCurrentTheme();
    let themeToggle = document.getElementById('theme-toggle');
    let themeButton = document.getElementById('theme-button');
    if (theme == true){
        try {
            toggle == true;
            toggle = true;
            applyDarkStyling();
            document.body.style.opacity = "1";
        } catch (error){
            applyDarkStyling();
            document.body.style.opacity = "1";
            showThemeNotif("dark")
        }
        themeToggle.innerHTML = "<i class=\"fas fa-sun fa-xs\"></i>";
        themeToggle.title = "Switch to light theme";
        themeToggle.style.marginBottom = "0";
    } else {
        try {
            toggle == false;
            toggle = false;
            applyLightStyling();
            document.body.style.opacity = "1";
        } catch (error){
            applyLightStyling();
            document.body.style.opacity = "1";
            showThemeNotif("light");
        }
        themeToggle.innerHTML = "<i class=\"fas fa-moon fa-xs\"></i>";
        themeToggle.title = "Switch to dark theme";
        themeToggle.style.marginBottom = "0";
    }
    document.body.style.transition = "background-color 0.6s ease-in-out, color 0.6s ease-in-out, transform 0.6s ease-in-out";
    document.querySelector('a').style.transition = "color .15s ease-in-out, background-color .6s ease-in-out, border-color .15s ease-in-out;";
    document.getElementById('navbar').style.transition = "background-color 0.6s ease-in-out, color 0.6s ease-in-out";
}

//todo: remove this??

//sometimes the page will scroll a bit too far when using the 'Skip to content' link
//this is an attempt to fix that
if(window.location.href.includes('#main-content')){
    setTimeout(function(){window.scrollTo(0,0);}, 50);
}

document.body.style.opacity = 0;
document.body.style.backgroundColor = "white";
window.onload = function(){
    initTheming()
    document.getElementById('theme-button').addEventListener("click", toggleTheme);
}

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

function addCloseButton(){
    try{
        if (added){
            return
        }
    } catch(error){
        added = true
    }
    console.log("adding close button")
    document.getElementById('theme-notif-close').style.transform = "scale(1, 1)";
    document.getElementById('theme-notif').style.width = "445px";
    added = true
}

function removeCloseButton(){
    if (! added){
        return
    }
    console.log("removing close button")
    document.getElementById('theme-notif-close').style.transform = "scale(0.01, 0.01)";
    document.getElementById('theme-notif').style.width = "425px";
    added = false
}

function getNotifRef(name){
    return bootstrap.Toast.getOrCreateInstance(document.getElementById(name))
}

function hideThemeNotif(){
    if (held){
        console.log("Attempted to hide theme notif when it was held!")
        return
    }
    console.log("Hiding theme notif")
    document.getElementById("theme-notif").style.marginBottom = "1.5%";
    setTimeout(getNotifRef('theme-notif').hide(), 500);
}

function holdNotif(){
    if (held){
        console.log("Notif already held!")
        return //event handler may have gone off twice
    }
    console.log('Holding notif')
    let themeNotifRef = getNotifRef('theme-notif');
    clearTimeout(notifEndAnim);
    held = true
}

function releaseNotif(){
    if (! held){
        return
    }
    console.log("Releasing notif, hiding after " + String(notifEndAnimDelay) + "ms")
    held = false;
    notifEndAnim = setTimeout(hideThemeNotif, notifEndAnimDelay);
}

function showThemeNotif(theme){
    console.log("Showing notif")
    notifEndAnimDelay = 5400
    held = false
    let themeNotif = document.getElementById("theme-notif")
    if (source == "system"){
        document.getElementById("theme-set").innerHTML = "Automatically enabled <b> " + theme + " theme</b> based on your system theme." + document.getElementById("theme-set").innerHTML;
    } else {
        document.getElementById("theme-set").innerHTML = "Automatically enabled <b> " + theme + " theme</b> based on your previous session." + document.getElementById("theme-set").innerHTML;
    }
    //mouse events
    themeNotif.addEventListener("mouseover", addCloseButton);
    themeNotif.addEventListener("mouseover", holdNotif);
    themeNotif.addEventListener("mouseout", removeCloseButton);
    themeNotif.addEventListener("mouseout", releaseNotif);
    //focus events e.g tab key
    themeNotif.addEventListener("focusin", addCloseButton);
    themeNotif.addEventListener("focusin", holdNotif);
    themeNotif.addEventListener("focusout", removeCloseButton);
    themeNotif.addEventListener("focusout", releaseNotif);
    //touch events
    themeNotif.addEventListener("touchstart", addCloseButton);
    themeNotif.addEventListener("touchstart", holdNotif);
    themeNotif.addEventListener("touchend", removeCloseButton);
    themeNotif.addEventListener("touchend", releaseNotif);
    getNotifRef('theme-notif').show();
    setTimeout(function(){document.getElementById("theme-notif").style.marginBottom = "1%";}, 500)
    notifEndAnim = setTimeout(hideThemeNotif, notifEndAnimDelay)
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

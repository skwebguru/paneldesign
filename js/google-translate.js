

function TranslateInit() {
  let code = TranslateGetCode();
  //console.log(googleTranslateConfig.domain);
  
  $('[data-google-lang="' + code + '"]').addClass("language__img_active");

  if (code == googleTranslateConfig.lang) {
   
    TranslateCookieHandler(null, googleTranslateConfig.domain);
  }

  
  new google.translate.TranslateElement({
    pageLanguage: googleTranslateConfig.lang,
  });

  //console.log(googleTranslateConfig.directlang);

  //console.log(code);

  if (
    typeof googleTranslateConfig.directlang != "undefined" &&
    code != googleTranslateConfig.directlang &&
    typeof code != "undefined"
  ) {
    TranslateCookieHandler(null, googleTranslateConfig.domain);
    TranslateCookieHandler(
      "/" + googleTranslateConfig.lang + "/" + googleTranslateConfig.directlang,
      googleTranslateConfig.domain
    );

    window.location.reload();
  }

    $("[data-google-lang]").click(function () {
      TranslateCookieHandler(
        "/auto/" + $(this).attr("data-google-lang"),
        googleTranslateConfig.domain
      );

      window.location.reload();
    });
}

function TranslateGetCode() {
  let lang =
    $.cookie("googtrans") != undefined && $.cookie("googtrans") != "null"
      ? $.cookie("googtrans")
      : googleTranslateConfig.lang;
  
  return lang.match(/(?!^\/)[^\/]*$/gm)[0];
}

function TranslateCookieHandler(val, domain) {
 
  $.cookie("googtrans", val, {
    domain: "." + document.domain.replace("www.", ""),
  });
  $.cookie("googtrans", val, {
    domain: "." + document.domain.replace("www.",""),
  });

  if (domain == "undefined") return;
 
  $.cookie("googtrans", val, {
    domain: domain,
  });

  $.cookie("googtrans", val, {
    domain: "." + domain,
  });
}

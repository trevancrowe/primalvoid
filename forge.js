
//Review Forge Submission

function reviewForgeSubmission() {
    var forgeEmail = document.getElementById("forgeEmail").value;
    var forgeFirstName = document.getElementById("forgeFirstName").value;
    var forgeLastName = document.getElementById("forgeLastName").value;
    var forgeAddress1 = document.getElementById("forgeAddress1").value;
    var forgeAddress2 = document.getElementById("forgeAddress2").value;
    var forgeCity = document.getElementById("forgeCity").value;
    var forgeRegion = document.getElementById("forgeRegion").value;
    var forgeCountry = document.getElementById("forgeCountry").value;
    var forgeZip = document.getElementById("forgeZip").value;
    var printSize = document.getElementsByName("Print-Size");
    var printSizeSelected;
    for (i = 0; i < printSize.length; i++) {
        if (printSize[i].checked) {
            printSizeSelected = printSize[i].value;
        }
    }
    var printOptions = document.getElementsByName("Print-Options");
    var printOptionSelected;
    for (i = 0; i < printOptions.length; i++) {
        if (printOptions[i].checked) {
            printOptionSelected = printOptions[i].value;
        }
    }


    document.getElementById("forge-review-size").innerHTML = printSizeSelected;
    document.getElementById("forge-review-options").innerHTML = printOptionSelected;
    document.getElementById("forge-review-email").innerHTML = forgeEmail;
    document.getElementById("forge-review-firstname").innerHTML = forgeFirstName;
    document.getElementById("forge-review-lastname").innerHTML = forgeLastName;
    document.getElementById("forge-review-address1").innerHTML = forgeAddress1;
    document.getElementById("forge-review-address2").innerHTML = forgeAddress2;
    document.getElementById("forge-review-city").innerHTML = forgeCity;
    document.getElementById("forge-review-region").innerHTML = forgeRegion;
    document.getElementById("forge-review-country").innerHTML = forgeCountry;
    document.getElementById("forge-review-zip").innerHTML = forgeZip;
};

$(document).on('click', '.forge-review-next', function () {
    reviewForgeSubmission();
});


// Forge form handler


//Select NFTs
var selectedNFTs = [];
function selectNFT() {
    //var selectedNFTs = [];
    $('.forge-selectednfts-next').hide();
    $(document).ready(function () {
        $(document).on('click', '.nftselectionstyle', function () {
            if ($(this).hasClass("NFTselected")) {
                $(this).toggleClass("NFTselected");
                var removeItem = this.htmlFor;
                var arrayNew = $.grep(selectedNFTs, function (value) {
                    return value != removeItem;
                });
                selectedNFTs = arrayNew.slice(0);
            }
            else {
                $(this).toggleClass("NFTselected");
                selectedNFTs.push(this.htmlFor);
            }

            if (selectedNFTs.length >= 1) {

                $('.forge-selectednfts-next').fadeIn("slow").css('display', 'flex');
            } else {
                $('.forge-selectednfts-next').fadeOut("slow");
            }
        });
    });
};

//Select Size
document.getElementById("20X30").disabled = true;
document.getElementById("16X24").disabled = true;
$(document).on('click', '.forge-printsize-container .w-radio', function () {
    if ($('input[name=Print-Size]:checked').length > 0) {
        $('.forge-selectedsize-next').fadeIn("slow").css('display', 'flex');
    } else {
        $('.forge-selectedsize-next').fadeOut("slow");
    }
});

//Select Options
$(document).on('click', '.forge-type-container .w-radio', function () {
    if ($('input[name=Print-Options]:checked').length > 0) {
        $('.forge-selectedtype-next').fadeIn("slow").css('display', 'flex');
    } else {
        $('.forge-selectedtype-next').fadeOut("slow");
    }
});

//Shipping Details

function checkInputs() {
    var isValid = true;
    $('.primary-text-field').filter('[required]').each(function () {
        if ($(this).val() === '') {
            $('.forge-review-next').fadeOut("slow").hide();
            isValid = false;
            return false;
        }
    });
    if (isValid) { $('.forge-review-next').fadeIn("slow").css('display', 'flex'); }
    return isValid;
};


//Enable or disable button based on if inputs are filled or not
$('.primary-text-field').filter('[required]').on('keyup', function () {
    checkInputs();
});

// Log forged artifacts


$('#wf-form-Forge-Form').submit(function () {
    forgeNFTs();
});


forgeNFTs = async () => {
    const currentUser = Moralis.User.current();
    var currentlyForgedNFTs = currentUser.attributes.NFTsForged;
    var newForgedNFTs = [];
    newForgedNFTs = currentlyForgedNFTs.concat(selectedNFTs);
    currentUser.set('NFTsForged', newForgedNFTs);
    await currentUser.save();
};





// get NFTs for forge

init = async () => {
    const currentUser = Moralis.User.current();
    let query = new Moralis.Query('User');
    let subscription = await query.subscribe();
    subscription.on('update', (object) => {
    });


}

init();



if (currentUser) {
    $(".forge-content").hide();
} else {
    $(".forge-connect-content").show();
    $(".forge-no-nfts").hide();
    $(".forge-owned-nfts-wrapper").hide();
}

async function getNFTs() {
    // get NFTs for current user on Mainnet
    const options = { token_address: '0x7d256d82b32d8003d1ca1a1526ed211e6e0da9e2' };
    const userEthNFTs = await Moralis.Web3API.account.getNFTs(options);
    const currentUser = Moralis.User.current();
    var currentlyForgedNFTs = currentUser.attributes.NFTsForged;

    userEthNFTs.result.forEach(function (nft) {
        async function getMetaData() {
            let url = (nft.token_uri);
            let address = (nft.token_id);
            let NFTname = (nft.token_id);
            const params = { theUrl: url };
            const metadata = await Moralis.Cloud.run("fetchJSON", params);

            if ($.inArray(NFTname, currentlyForgedNFTs) != -1) {
                $("#NFTselection").html($("#NFTselection").html() + "<div class='already-forged' style='position:relative;'><h6 class='already-forged-title' style='position:absolute; bottom:20px; width:100%; z-index:2; text-align:center; background:black; padding:15px;'>This Artifact has already been forged</h6><img style='border-radius:5px; opacity:.5;' src='" + fixURL(metadata.data.image) + "'/><div>");

            } else {
                $("#NFTselection").html($("#NFTselection").html() + "<input style='display:none;' type='checkbox' data-name='" + (metadata.data.name) + "' name='NFT-Selection' value='" + (NFTname) + "' id='" + (address) + "'/> <label class='nftselectionstyle' for='" + (address) + "'><img style='border-radius:5px;' src='" + fixURL(metadata.data.image) + "'/></label>");
            }
        };
        getMetaData();

    });

    //If the user owns any Primal Void NFTs, show them, otherwise show them the "no nfts" state
    if (userEthNFTs.total >= 1) {
        $('.forge-scanning-loader').fadeOut("slow");
        $(".forge-owned-nfts-wrapper").delay(1000).fadeIn("slow");
        $(".forge-print-form").delay(1000).fadeIn("slow");

    } else {
        $('.forge-scanning-loader').fadeOut("slow");
        $(".forge-no-nfts").delay(500).fadeIn("slow");
    }

    function checkWidth() {
        var $window = $(window);
        var windowsize = $window.width();
        if (windowsize <= 767) {
            $('.forge-owned-nfts').css('grid-template-columns', '1fr');  
        }
        if (windowsize <= 991 && windowsize >= 768) {
            if (userEthNFTs.total == 1) { $('.forge-owned-nfts').css('grid-template-columns', '1fr'); };
            if (userEthNFTs.total == 2) { $('.forge-owned-nfts').css('grid-template-columns', '1fr 1fr'); };
        }
        if (windowsize <= 1440 && windowsize >= 992) {
            if (userEthNFTs.total == 1) { $('.forge-owned-nfts').css('grid-template-columns', '1fr'); };
            if (userEthNFTs.total == 2) { $('.forge-owned-nfts').css('grid-template-columns', '1fr 1fr'); };
            if (userEthNFTs.total == 3) { $('.forge-owned-nfts').css('grid-template-columns', '1fr 1fr 1fr'); };
        }
        if (windowsize >= 1440) {
            if (userEthNFTs.total == 1) { $('.forge-owned-nfts').css('grid-template-columns', '1fr'); };
            if (userEthNFTs.total == 2) { $('.forge-owned-nfts').css('grid-template-columns', '1fr 1fr'); };
            if (userEthNFTs.total == 3) { $('.forge-owned-nfts').css('grid-template-columns', '1fr 1fr 1fr'); };
            if (userEthNFTs.total == 3) { $('.forge-owned-nfts').css('grid-template-columns', '1fr 1fr 1fr 1fr'); };
        }
    }

}

$(document).ready(function() {
    checkWidth();
    $(window).resize(checkWidth);
});



function fixURL(url) {
    if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://ipfs").slice(-1)
    }
    else {
        return url + "?format=json"
    }
}

//getNFTs();
selectNFT();



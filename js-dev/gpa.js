$(function() {
  var userCourses = [];
  var currentDropdown;
  const grades = ["F", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];
  const shadeColor = function(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  //.slice(0) clones the array
  var shuffledColors = constants.colors.slice(0);
  shuffle(shuffledColors);
  var darkColors =  shuffledColors.map(function(item) {
    return shadeColor(item, -.2);
  });
  var lightColors = shuffledColors.map(function(item) {
    return shadeColor(item, +.2);
  })

  var setColors = function($tiles, $headTile) {
    if($headTile) {
      $headTile.css("background-color", shuffledColors[shuffledColors.length - 1]);
    }
    var ctr = 0;
    //sets background-color of each tile to some random color in const.js and colors of certain
    //elements to lighter version of background color
    $tiles.each(function(index) {
      $(this).css("background-color", shuffledColors[index % shuffledColors.length]);
      var color = lightColors[index % shuffledColors.length];
      $(this).children(".course-level, .final").children(".option").css("background-color", color);
    });
  }

  var initializeIndicator = function($tile) {
    //initialize width of each selected-indicator to width of first option
    var indicatorWidth1 = $tile.children(".course-level").children(".option").eq(0).outerWidth();
    var indicatorWidth2 = $tile.children(".final").children(".option").eq(0).outerWidth();
    $tile.children(".course-level").children(".selected-indicator").css("width", indicatorWidth1);
    $tile.children(".final").children(".selected-indicator").css("width", indicatorWidth2);
  }

  //animates selected-indicator to an option
  var animateIndicator = function($option) {
    var indicatorWidth = $option.outerWidth();
    var translateX = 0;
    //Adds widths of all preceding siblings
    $option.prevAll().each(function() {
      translateX += $(this).outerWidth();
    })
    $option.siblings(".selected-indicator").css({width: indicatorWidth, transform: "translateX(" + translateX + "px)"});
  }

  //handles all modifications to a course on .option click
  var optionModifyCourse = function($option, tileIndex) {
    switch($option.text()) {
      case "Has Final":
        //show final
        $(".gpa-tile").eq(tileIndex).children(".grades").children(".term").eq(3).css("display", "block");
        //modify course object
        userCourses[tileIndex].hasFinal = true;
        break;
      case "No Final":
        //hide final
        $(".gpa-tile").eq(tileIndex).children(".grades").children(".term").eq(3).css("display", "none");
        userCourses[tileIndex].hasFinal = false;
        break;
      case "Regular":
        userCourses[tileIndex].level = 0;
        break;
      case "Accelerated":
        userCourses[tileIndex].level = 1;
        break;
      case "Honors/AP":
        userCourses[tileIndex].level = 2;
    }
    recalculateGPA(tileIndex);
  }

  var onOptionMouseDown = function() {
    var color = darkColors[$(".gpa-tile").index($(this).parents(".gpa-tile")) % darkColors.length];
    $(this).css("background-color", color);
    animateIndicator($(this));
  }

  var onOptionMouseUp = function() {
    var tileIndex = $(".gpa-tile").index($(this).parents(".gpa-tile"));
    var color = lightColors[tileIndex % lightColors.length];
    $(this).css("background-color", color);
    optionModifyCourse($(this), tileIndex);
  }

  //opens dropdown when user clicks to choose grade
  var showDropDown = function(e) {
    var gradeOptions = $("#grade-options");
    gradeOptions.css({display: "none", height: 0});
    var height = $(this).outerHeight(), width = $(this).outerWidth();
    var offset = $(this).offset();
    gradeOptions.css("display", "inline-block");
    //small delay for animation
    setTimeout(function(){
      gradeOptions.css({top: offset.top + height, left: offset.left, width: width, height: 200});
    }, 10);
    currentDropdown = $(this);
    //stops propagation to html to prevent dropdown from closing as soon as it opens
    e.stopPropagation();
  }

  //closes dropdown when user clicks anywhere else
  var hideDropDown = function() {
    $("#grade-options").css({display: "none", height: 0});
    currentDropdown = undefined;
  }
  $("html").on("mousedown touchstart", hideDropDown);

  //set grade for term when user clicks on a grade in the dropdown
  $("#grade-options").children().on("mousedown touchstart", function() {
    if(currentDropdown) {
      var grade = $(this).text();
      currentDropdown.children("span").text(grade);
      var tileIndex = $(".gpa-tile").index(currentDropdown.parents(".gpa-tile"));
      var dropdownIndex = $(".gpa-tile").eq(tileIndex).children(".grades").find(".grade").index(currentDropdown);
      userCourses[tileIndex].grades[dropdownIndex] = grades.indexOf(grade);
      recalculateGPA(tileIndex);
    }
  });

  var onCourseCloseClick = function() {
    var tileIndex = $(".gpa-tile").index($(this).parent());
    removeCourse(tileIndex);
  }

  var courseNameClick = function() {
    //Clears name if it is the defualt
    if($(this).text().indexOf("Course ") == 0) {
      $(this).text("");
    }
  }

  var courseChangeName = function() {
    var tileIndex = $(".gpa-tile").index($(this).parent());
    userCourses[tileIndex].name = $(this).text();
    save();
  }

  var leftArrowClick = function() {
    modifyGrade($(this).parents(".gpa-tile"), -1);
  }

  var rightArrowClick = function() {
    modifyGrade($(this).parents(".gpa-tile"), 1);
  }

  var modifyGrade = function($tile, amount) {
    var tileIndex = $(".gpa-tile").index($tile);
    var course = userCourses[tileIndex];
    course.grades = course.grades.map(function(item) {
      return Math.max(Math.min(item + amount, 12), 0);
    });
    recalculateGPA(tileIndex);
    displayCourseOnTile(course, $tile);
  }

  var recalculateGPA = function(tileIndex) {
    var course = userCourses[tileIndex];
    var totalPoints = course.grades[0] + course.grades[1] + course.grades[2] + (course.hasFinal? course.grades[3] : 0);
    if(course.hasFinal){
      //The cutoff for F is slightly higher than it should be so it is a special case
      var grade = (totalPoints <= 2)? "F" : grades[Math.round(totalPoints / 4)];
    } else {
      var grade = grades[Math.round(totalPoints / 3)];
    }
    var isF = function(grade) {
      return grade == 0;
    }
    //Special rules
    if(course.hasFinal && course.grades[2] == 0 && course.grades[3] == 0) grade = "F";
    else if(course.hasFinal && course.grades.filter(isF).length >= 3) grade = "F";
    else if(!course.hasFinal && course.grades.filter(isF).length >= 2) grade = "F";
    //F always results in a GPA of 0 regardless of course level
    var gpa = (grade == "F")? 0 : Math.ceil(grades.indexOf(grade) / 3) + course.level / 2;

    course.finalGrade = grade;
    //Always shows 1 place after decimal point even if it is 0
    course.finalGPA = gpa.toFixed(1);
    $(".gpa-tile").eq(tileIndex).children(".final-grade").children("span").text(course.finalGrade);
    $(".gpa-tile").eq(tileIndex).children(".final-gpa").text(course.finalGPA);
    recalculateOverallGPA();
  }

  var recalculateOverallGPA = function() {
    //Average all course GPAs
    var overallGpa = 0;
    userCourses.forEach(function(course) {
      overallGpa += parseFloat(course.finalGPA);
    });
    //Prevent NaN if no courses are added
    overallGpa /= (userCourses.length == 0)? 1 : userCourses.length;
    //Show 2 decimal places
    $(".gpa-head-tile .overall-gpa").text(overallGpa.toFixed(2));
    save();
  }

  var displayCourseOnTile = function(course, $tile) {
    setColors($(".gpa-tile"), $('.gpa-head-tile'));
    $tile.css("display", "flex");
    initializeIndicator($tile);
    $tile.children(".name").text(course.name);
    $tile.children(".name").attr("contenteditable", "true");
    animateIndicator($tile.children(".course-level").children().eq(course.level));
    animateIndicator($tile.children(".final").children().eq(course.hasFinal? 0 : 1));
    $tile.children(".grades").children(".term").eq(3).css("display", course.hasFinal? "block" : "none");
    $tile.children(".grades").children(".term").each(function(index) {
      $(this).children(".grade").children("span").text(grades[course.grades[index]]);
    });
    $tile.children(".final-grade").children("span").text(course.finalGrade);
    $tile.children(".final-gpa").text(course.finalGPA);
  }

  var addCourse = function(course) {
    userCourses.push(course);
    var $tile = $("#sampleGpaTile").clone();
    $tile.removeAttr("id");
    $tile.addClass("gpa-tile");
    $tile.children(".close").click(onCourseCloseClick);
    $tile.children(".name").on("input", courseChangeName);
    $tile.children(".name").click(courseNameClick);
    $tile.children(".course-level,.final").children(".option").on("mousedown touchstart", onOptionMouseDown);
    $tile.children(".course-level,.final").children(".option").on("mouseup touchend", onOptionMouseUp);
    $tile.children(".grades").children(".term").children(".grade").on("mousedown touchstart", showDropDown);
    $tile.children(".final-grade").children("i").eq(0).click(leftArrowClick);
    $tile.children(".final-grade").children("i").eq(1).click(rightArrowClick);

    recalculateGPA(userCourses.length - 1);
    $("#tiles").append($tile);
    displayCourseOnTile(course, $tile);
  }

  var addBlankCourse = function() {
    var courseNumber = $(".gpa-tile").length + 1;
    addCourse({
      name: "Course " + courseNumber,
      level: 0,
      hasFinal: true,
      grades: [11, 11, 11, 11],
      finalGrade: "", //will be calculated
      finalGPA: "" //will be calculated
    });
  }

  var removeCourse = function(index) {
    userCourses.splice(index, 1);
    //setting display none instead of removing in order to preserve colors
    $(".gpa-tile").eq(index).css("display", "none");
    recalculateOverallGPA();
  }

  var save = function() {
    localStorage.courses = JSON.stringify(userCourses);
  }

  var load = function() {
    if(localStorage.courses) {
      var courses = JSON.parse(localStorage.courses);
      courses.forEach(function(item) {
        addCourse(item);
      });
    }
  }

  $(".gpa-head-tile .add-course").click(function() {
    addBlankCourse();
  });

  if(localStorage.courses) {
    load();
  } else {
    addBlankCourse();
    addBlankCourse();
  }
});

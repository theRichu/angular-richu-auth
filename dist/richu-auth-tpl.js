angular.module('richu.auth').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/findpassword.html',
    "<form class=\"reg-page\" name=\"findpassword\" ng-submit=\"vm.submit()\"><div class=\"reg-header\"><h2>패스워드 찾기</h2></div><div class=\"input-group margin-bottom-20\"><p ng-hide=\"vm.sent\">가입하실때 입력하신 이메일주소를 입력해주세요</p><div ng-show=\"vm.sent\"><h2>이메일을 확인해 주십시오</h2><p>전송되었습니다!<br>메일에 전달된 링크를 통해 새로운 패스워드를 등록해 주세요!</p></div><input class=\"form-control\" name=\"email\" ng-model=\"vm.email\" placeholder=\"Email\" required type=\"email\"><div class=\"form-errors\" data-ng-if=\"findpassword.email.$dirty\"><div class=\"form-error\" ng-show=\"findpassword.email.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"findpassword.email.$error.minlength\">계정이 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"findpassword.email.$error.required\">필수 입력 항목입니다.</div></div></div><div class=\"row\"><div class=\"col-md-12 text-right\"><button class=\"btn btn-success\" data-ng-disabled=\"findpassword.$invalid\" type=\"submit\">완료</button></div></div></form>"
  );


  $templateCache.put('templates/join.html',
    "<form name=\"signup\" ng-submit=\"join(signupForm)\" novalidate><div class=\"reg-block-header\"><h2>회원가입</h2><p>이미 가입하셨나요? 그렇다면 <a class=\"btn btn-info\" data-ui-sref=\"anon.login\">로그인</a> 하세요</p></div><label ng-class=\"{ 'has-error' : signup.name.$invalid && signup.name.$dirty}\">이름 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span> <input class=\"form-control\" name=\"name\" ng-maxlength=\"50\" ng-minlength=\"2\" placeholder=\"이름\" required x-ng-model-options=\"{ updateOn: 'blur' }\" x-ng-model=\"signupForm.name\"></div><div class=\"form-errors\" data-ng-if=\"signup.name.$dirty\"><div class=\"form-error\" ng-show=\"signup.name.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"signup.name.$error.minlength\">이름이 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"signup.name.$error.required\">필수 입력 항목입니다.</div></div><label ng-class=\"{ 'has-error' : signup.username.$invalid &&\n" +
    "    signup.username.$dirty}\">아이디 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span> <input class=\"form-control\" name=\"username\" ng-change=\"checkIfExists(signup.username)\" ng-maxlength=\"50\" ng-minlength=\"2\" placeholder=\"아이디\" required x-ng-model-options=\"{ updateOn: 'blur' }\" x-ng-model=\"signupForm.username\"></div><div class=\"form-errors\" data-ng-if=\"signup.username.$dirty\"><div class=\"form-error\" ng-show=\"signup.username.$error.required\">필수 입력 항목입니다.</div><div class=\"form-error\" ng-show=\"signup.username.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"signup.username.$error.minlength\">아이디가 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"signup.username.$error.exists\">이미 가입되어 있습니다.</div></div><label ng-class=\"{ 'has-error' : signup.email.$invalid && signup.email.$dirty}\">이메일 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-lock\"></i></span> <input class=\"form-control\" name=\"email\" ng-change=\"checkIfEmailExists(signup.email)\" ng-maxlength=\"255\" ng-minlength=\"2\" placeholder=\"이메일\" required type=\"email\" x-ng-model-options=\"{ updateOn: 'blur' }\" x-ng-model=\"signupForm.email\"></div><div class=\"form-errors\" data-ng-if=\"signup.email.$dirty\"><div class=\"form-error\" ng-show=\"signup.email.$error.required\">필수 입력 항목입니다.</div><div class=\"form-error\" ng-show=\"signup.email.$error.maxlength\">255자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"signup.email.$error.minlength\">이메일 주소가 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"signup.email.$error.exists\">이미 가입되어 있습니다.</div></div><label ng-class=\"{ 'has-error' : signup.password.$invalid && signup.password.$dirty,\n" +
    "    'valid-lr' : !signup.confirmation.$error}\">비밀번호 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-lock\"></i></span> <input class=\"form-control\" compare-to=\"confirmPassword\" name=\"password\" ng-maxlength=\"25\" ng-minlength=\"8\" placeholder=\"비밀번호\" required type=\"password\" x-ng-model=\"signupForm.password\"></div><div class=\"form-errors\" data-ng-if=\"signup.password.$dirty\"><div class=\"form-error\" ng-show=\"signup.password.$error.required\">필수 입력 항목입니다.</div><div class=\"form-error\" ng-show=\"signup.password.$error.maxlength\">25자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"signup.password.$error.minlength\">비밀번호는 8자 이상으로 입력해주세요</div><div class=\"form-error\" ng-if=\"signup.confirmation.$dirty\" ng-show=\"signup.password.$modelValue !==\n" +
    "      signup.confirmation.$modelValue\">입력한 비밀번호가 서로 다릅니다.</div></div><label ng-class=\"{ 'has-error' : signup.confirmation.$invalid &&\n" +
    "    signup.confirmation.$dirty}\">비밀번호 확인 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span> <input class=\"form-control\" name=\"confirmation\" ng-maxlength=\"25\" ng-minlength=\"8\" placeholder=\"비밀번호\" required type=\"password\" x-ng-model=\"confirmPassword\"></div><hr><div class=\"row\"><div class=\"col-lg-6 checkbox\"><label><input name=\"agree\" required type=\"checkbox\" x-ng-model=\"agree\"> <a class=\"color-green\" href=\"page_terms.html\">이용약관</a>에 동의합니다.</label></div></div><button class=\"btn btn-block btn-success\" data-ng-disabled=\"signup.$invalid || signupForm.loading\" type=\"submit\"><span data-ng-show=\"!loginForm.loading\">가입하기</span> <span class=\"fa fa-spinner\" data-ng-show=\"loginForm.loading\"></span> <span data-ng-show=\"loginForm.loading\">처리중입니다..</span></button></form>"
  );


  $templateCache.put('templates/leave.html',
    "<form class=\"reg-page\" name=\"login\" ng-submit=\"startLeave()\"><div class=\"reg-header\"><h2>회원 탈퇴</h2></div><div class=\"input-group margin-bottom-20\"><p>회원 탈퇴를 하시면, 자료를 되살릴 수 없습니다.</p><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span> <input class=\"form-control\" name=\"identifier\" ng-model=\"leaveForm.identifier\" placeholder=\"Username or Email\" required><div class=\"form-errors\" data-ng-if=\"login.identifier.$dirty\"><div class=\"form-error\" ng-show=\"login.identifier.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"login.identifier.$error.minlength\">계정이 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"login.identifier.$error.required\">필수 입력 항목입니다.</div></div></div><div class=\"input-group margin-bottom-20\"><span class=\"input-group-addon\"><i class=\"fa fa-lock\"></i></span> <input class=\"form-control\" name=\"password\" ng-model=\"leaveForm.password\" placeholder=\"Password\" required type=\"password\"><div class=\"form-errors\" data-ng-if=\"login.password.$dirty\"><div class=\"form-error\" ng-show=\"login.password.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"login.password.$error.minlength\">비밀번호가 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"login.password.$error.required\">필수 입력 항목입니다.</div></div></div><div class=\"row\"><div class=\"col-md-6 checkbox\"></div><div class=\"col-md-6 text-right\"><button class=\"btn btn-success\" data-ng-disabled=\"login.$invalid\" type=\"submit\">탈퇴하기</button></div></div><hr></form>"
  );


  $templateCache.put('templates/login.html',
    "<form class=\"reg-page\" name=\"login\" ng-submit=\"startLogin()\"><div class=\"reg-header\"><h2>로그인</h2></div><div class=\"input-group margin-bottom-20\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span> <input class=\"form-control\" name=\"identifier\" ng-model=\"loginForm.identifier\" placeholder=\"Username or Email\" required><div class=\"form-errors\" data-ng-if=\"login.identifier.$dirty\"><div class=\"form-error\" ng-show=\"login.identifier.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"login.identifier.$error.minlength\">계정이 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"login.identifier.$error.required\">필수 입력 항목입니다.</div></div></div><div class=\"input-group margin-bottom-20\"><span class=\"input-group-addon\"><i class=\"fa fa-lock\"></i></span> <input class=\"form-control\" name=\"password\" ng-model=\"loginForm.password\" placeholder=\"Password\" required type=\"password\"><div class=\"form-errors\" data-ng-if=\"login.password.$dirty\"><div class=\"form-error\" ng-show=\"login.password.$error.maxlength\">50자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"login.password.$error.minlength\">비밀번호가 너무 짧습니다.</div><div class=\"form-error\" ng-show=\"login.password.$error.required\">필수 입력 항목입니다.</div></div></div><div class=\"row\"><div class=\"col-md-6 checkbox\"></div><div class=\"col-md-6 text-right\"><button class=\"btn btn-success pull-right\" data-ng-disabled=\"login.$invalid\" type=\"submit\">Login</button></div>패스워드 찾기</div><hr><h4>패스워드가 기억나지 않으세요?</h4><p>걱정마세요, <a class=\"color-green\" href=\"#\">여기</a>를 클릭하여 패스워드를 재설정 하실 수 있습니다.</p></form>"
  );


  $templateCache.put('templates/resetpassword.html',
    "<form class=\"reg-page\" name=\"resetpassword\" ng-submit=\"vm.submit()\"><div class=\"reg-header\"><h2>패스워드 변경</h2></div><label ng-class=\"{ 'has-error' : resetpassword.password.$invalid && resetpassword.password.$dirty,\n" +
    "    'valid-lr' : !resetpassword.confirmation.$error}\">비밀번호 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-lock\"></i></span> <input class=\"form-control\" compare-to=\"confirmPassword\" name=\"password\" ng-maxlength=\"25\" ng-minlength=\"8\" placeholder=\"비밀번호\" required type=\"password\" x-ng-model=\"vm.password\"></div><div class=\"form-errors\" data-ng-if=\"resetpassword.password.$dirty\"><div class=\"form-error\" ng-show=\"resetpassword.password.$error.required\">필수 입력 항목입니다.</div><div class=\"form-error\" ng-show=\"resetpassword.password.$error.maxlength\">25자 이상을 넘을 수 없습니다.</div><div class=\"form-error\" ng-show=\"resetpassword.password.$error.minlength\">비밀번호는 8자 이상으로 입력해주세요</div><div class=\"form-error\" ng-if=\"resetpassword.confirmation.$dirty\" ng-show=\"resetpassword.password.$modelValue !==\n" +
    "      resetpassword.confirmation.$modelValue\">입력한 비밀번호가 서로 다릅니다.</div></div><label ng-class=\"{ 'has-error' : resetpassword.confirmation.$invalid &&\n" +
    "    resetpassword.confirmation.$dirty}\">비밀번호 확인 <span class=\"color-red\">*</span></label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span> <input class=\"form-control\" name=\"confirmation\" ng-maxlength=\"25\" ng-minlength=\"8\" placeholder=\"비밀번호\" required type=\"password\" x-ng-model=\"confirmPassword\"></div><div class=\"row\"><div class=\"col-md-6 checkbox\"></div><div class=\"col-md-6 text-right\"><button class=\"btn btn-success pull-right\" data-ng-disabled=\"resetpassword.$invalid\" type=\"submit\">패스워드 변경</button></div></div><hr><h4>패스워드가 기억나지 않으세요?</h4><p>걱정마세요, <a class=\"color-green\" href=\"#\">여기</a>를 클릭하여 패스워드를 재설정 하실 수 있습니다.</p></form>"
  );

}]);

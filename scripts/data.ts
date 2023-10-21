/**
 * @var 0 成员(Member)
 * @var 1 联合管理员(Co-Administrator)
 * @var 2 管理员(Administrator)
 */
type permissions = 0 | 1 | 2;

interface Label_regex {
  [Key: string]: {
    regex: RegExp;
    permission: permissions;
  };
}

interface Member {
  /**
   * @var 0 成员(Member)
   * @var 1 联合管理员(Co-Administrator)
   * @var 2 管理员(Administrator)
   */
  permission: permissions;
  login: string;
}

const labels_regex_add: Label_regex = {
  "Administrator-Approved": {
    regex: /\[[Pp]olicy\]\s+[Aa]dministrator[\s-][Aa]pproved]/,
    permission: 1,
  },
  Announcement: {
    regex: /\[[Pp]olicy\]\s+[Aa]nnouncement/,
    permission: 2,
  },
  "Blocking-issue": {
    regex: /\[[Pp]olicy\]\s+[bB]locking[\s-][Ii]ssue/,
    permission: 0,
  },
  "Breaking-Change": {
    regex: /\[[Pp]olicy\]\s+[Bb]reaking[\s-][Cc]hange/,
    permission: 0,
  },
  bug: { regex: /\[[Pp]olicy\]\s+[Bb]ug/, permission: 0 },
  "Command-Execute": {
    regex: /\[[Pp]olicy\]\s+[Cc]ommand[\s-][Ee]xecute/,
    permission: 1,
  },
  Commissions: { regex: /\[[Pp]olicy\]\s+[Cc]ommissions/, permission: 1 },
  "Commissions-Member": {
    regex: /\[[Pp]olicy\]\s+[Cc]ommissions[\s-][Mm]ember/,
    permission: 1,
  },
  "Commissions-Policy": {
    regex: /\[[Pp]olicy\]\s+[Cc]ommissions[\s-][Pp]olicy/,
    permission: 1,
  },
  dependency: { regex: /\[[Pp]olicy\]\s+[Dd]ependenc(y|ies)/, permission: 0 },
  "Do-Not-Merge": {
    regex: /\[[Pp]olicy\]\s+[Dd]o[\s-][Nn]ot[\s-][Mm]erge/,
    permission: 0,
  },
  documentation: { regex: /\[[Pp]olicy\]\s+[Dd]ocumentation/, permission: 0 },
  duplicate: { regex: /\[[Pp]olicy\]\s+[Dd]uplicate/, permission: 0 },
  enhancement: { regex: /\[[Pp]olicy\]\s+[Ee]nhancement/, permission: 0 },
  "good first issue": {
    regex: /\[[Pp]olicy\]\s+[Gg]ood[\s-][Ff]irst[\s-][Ii]ssue/,
    permission: 0,
  },
  "help wanted": {
    regex: /\[[Pp]olicy\]\s+[Hh]elp[\s-][Ww]anted/,
    permission: 0,
  },
  invalid: { regex: /\[[Pp]olicy\]\s+[Ii]nvalid/, permission: 0 },
  "Member-Adding": {
    regex: /\[[Pp]olicy\]\s+[Mm]ember[\s-][Aa]dding/,
    permission: 1,
  },
  "Member-Approved": {
    regex: /\[[Pp]olicy\]\s+[Mm]ember[\s-][Aa]pproved/,
    permission: 0,
  },
  "Merge-Needed": {
    regex: /\[[Pp]olicy\]\s+[Mm]erge[\s-][Nn]eeded/,
    permission: 0,
  },
  "Needs-All-Approval": {
    regex: /\[[Pp]olicy\]\s+[Nn]eeds[\s-][Aa]ll[\s-][Aa]pproval/,
    permission: 0,
  },
  "Needs-Author-Feedback": {
    regex: /\[[Pp]olicy\]\s+[Nn]eeds[\s-][Aa]uthor[\s-][Ff]eedback/,
    permission: 0,
  },
  "Needs-Modify": {
    regex: /\[[Pp]olicy\]\s+[Nn]eeds[\s-][Mm]odify/,
    permission: 0,
  },
  "Needs-Triage": {
    regex: /\[[Pp]olicy\]\s+[Nn]eeds[\s-][Tt]riage/,
    permission: 0,
  },
  "Policy-Accepted": {
    regex: /\[[Pp]olicy\]\s+[Pp]olicy[\s-][Aa]ccepted/,
    permission: 0,
  },
  "Policy-Modify": {
    regex: /\[[Pp]olicy\]\s+[Pp]olicy[\s-][Mm]odify/,
    permission: 0,
  },
  "Policy-Rejected": {
    regex: /\[[Pp]olicy\]\s+[Pp]olicy[\s-][Rr]ejected/,
    permission: 0,
  },
  "Policy-Remove": {
    regex: /\[[Pp]olicy\]\s+[Pp]olicy[\s-][Rr]emove/,
    permission: 0,
  },
  "Policy-Request": {
    regex: /\[[Pp]olicy\]\s+[Pp]olicy[\s-][Rr]equest/,
    permission: 0,
  },
  "Project-File": {
    regex: /\[[Pp]olicy\]\s+[Pp]roject[\s-][Ff]ile/,
    permission: 0,
  },
};

const labels_regex_remove: Label_regex = {
  "Administrator-Approved": {
    regex: /\[[Pp]olicy\]\s+[Aa]dministrator[\s-][Aa]pproved]/,
    permission: 1,
  },
  Announcement: { regex: /\[[Rr]emove\]\s+[Aa]nnouncement/, permission: 2 },
  "Blocking-issue": {
    regex: /\[[Rr]emove\]\s+[bB]locking[\s-][Ii]ssue/,
    permission: 0,
  },
  "Breaking-Change": {
    regex: /\[[Rr]emove\]\s+[Bb]reaking[\s-][Cc]hange/,
    permission: 0,
  },
  bug: { regex: /\[[Rr]emove\]\s+[Bb]ug/, permission: 0 },
  "Command-Execute": {
    regex: /\[[Rr]emove\]\s+[Cc]ommand[\s-][Ee]xecute/,
    permission: 1,
  },
  Commissions: { regex: /\[[Rr]emove\]\s+[Cc]ommissions/, permission: 1 },
  "Commissions-Member": {
    regex: /\[[Rr]emove\]\s+[Cc]ommissions[\s-][Mm]ember/,
    permission: 1,
  },
  "Commissions-Policy": {
    regex: /\[[Rr]emove\]\s+[Cc]ommissions[\s-][Pp]olicy/,
    permission: 1,
  },
  dependency: { regex: /\[[Rr]emove\]\s+[Dd]ependenc(y|ies)/, permission: 0 },
  "Do-Not-Merge": {
    regex: /\[[Rr]emove\]\s+[Dd]o[\s-][Nn]ot[\s-][Mm]erge/,
    permission: 0,
  },
  documentation: { regex: /\[[Rr]emove\]\s+[Dd]ocumentation/, permission: 0 },
  duplicate: { regex: /\[[Rr]emove\]\s+[Dd]uplicate/, permission: 0 },
  enhancement: { regex: /\[[Rr]emove\]\s+[Ee]nhancement/, permission: 0 },
  "good first issue": {
    regex: /\[[Rr]emove\]\s+[Gg]ood[\s-][Ff]irst[\s-][Ii]ssue/,
    permission: 0,
  },
  "help wanted": {
    regex: /\[[Rr]emove\]\s+[Hh]elp[\s-][Ww]anted/,
    permission: 0,
  },
  invalid: { regex: /\[[Rr]emove\]\s+[Ii]nvalid/, permission: 0 },
  "Member-Adding": {
    regex: /\[[Rr]emove\]\s+[Mm]ember[\s-][Aa]dding/,
    permission: 1,
  },
  "Member-Approved": {
    regex: /\[[Rr]emove\]\s+[Mm]ember[\s-][Aa]pproved/,
    permission: 0,
  },
  "Merge-Needed": {
    regex: /\[[Rr]emove\]\s+[Mm]erge[\s-][Nn]eeded/,
    permission: 0,
  },
  "Needs-All-Approval": {
    regex: /\[[Rr]emove\]\s+[Nn]eeds[\s-][Aa]ll[\s-][Aa]pproval/,
    permission: 0,
  },
  "Needs-Author-Feedback": {
    regex: /\[[Rr]emove\]\s+[Nn]eeds[\s-][Aa]uthor[\s-][Ff]eedback/,
    permission: 0,
  },
  "Needs-Modify": {
    regex: /\[[Rr]emove\]\s+[Nn]eeds[\s-][Mm]odify/,
    permission: 0,
  },
  "Needs-Triage": {
    regex: /\[[Rr]emove\]\s+[Nn]eeds[\s-][Tt]riage/,
    permission: 0,
  },
  "Policy-Accepted": {
    regex: /\[[Rr]emove\]\s+[Pp]olicy[\s-][Aa]ccepted/,
    permission: 0,
  },
  "Policy-Modify": {
    regex: /\[[Rr]emove\]\s+[Pp]olicy[\s-][Mm]odify/,
    permission: 0,
  },
  "Policy-Rejected": {
    regex: /\[[Rr]emove\]\s+[Pp]olicy[\s-][Rr]ejected/,
    permission: 0,
  },
  "Policy-Remove": {
    regex: /\[[Rr]emove\]\s+[Pp]olicy[\s-][Rr]emove/,
    permission: 0,
  },
  "Policy-Request": {
    regex: /\[[Rr]emove\]\s+[Pp]olicy[\s-][Rr]equest/,
    permission: 0,
  },
  "Project-File": {
    regex: /\[[Rr]emove\]\s+[Pp]roject[\s-][Ff]ile/,
    permission: 0,
  },
  "Review-Needed": {
    regex: /\[[Rr]emove\]\s+[Rr]eview[\s-][Nn]eeded/,
    permission: 0,
  },
};

const members: Member[] = [
  {
    login: "coolplaylin",
    permission: 2,
  },
  {
    login: "jsrcode",
    permission: 2,
  },
  {
    login: "coolplaylinbot",
    permission: 2,
  },
  {
    login: "liulyxandy-codemao",
    permission: 1,
  },
  {
    login: "fufu3939",
    permission: 1,
  },
  {
    login: "quiet-star-gazing",
    permission: 0,
  },
  {
    login: "pangguanzhejers",
    permission: 0,
  },
  {
    login: "QiKeZhiCao",
    permission: 0,
  },
  {
    login: "svipwing",
    permission: 0,
  },
  {
    login: "DIAG5",
    permission: 0,
  },
  {
    login: "CHEN-EXE",
    permission: 0,
  },
];

export { labels_regex_add, labels_regex_remove, members, permissions };

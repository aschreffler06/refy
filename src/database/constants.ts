export abstract class Constants {
    static readonly MODS = ['NM', 'HD', 'HR', 'DT', 'FM', 'TB', 'EZ', 'FL', 'ACC'];
    static readonly GAMEMODE = ['std', 'mania', 'taiko', 'ctb'];
    static readonly WIN_CONDITION = ['score', 'scorev2', 'combo', 'acc', 'teamTag'];
    static readonly TOURNEY_ROUNDS = ['Group Stage', 'Ro128', 'Ro64', 'Ro32', 'Ro16', 'QF', 'SF', 'F', 'GF'];
    static readonly FORMAT = ['1v1', '2v2', '3v3', '4v4'];
    static readonly EVENT_TYPE = ['ban', 'pick', 'protect'];
    static readonly STAFF_ROLES = ['Host', 'Co-Host', 'Pooler', 'Playtester', 'Referee', 'Streamer', 'Commentator', 'GFX', 'Sheeter', 'Mapper'];
    static readonly TOURNEY_STATE = ['Prep', 'Registration', 'Qualifiers', 'Bracket', 'Finished'];
    static readonly MATCH_STATE = ['Upcoming', 'Ongoing', 'Finished'];
}
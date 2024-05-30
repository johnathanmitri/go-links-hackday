import React, { useState } from 'react';

// convert kilobytes to a string, that has them in units of KB, MB, or GB appropriately.
function formatSize(numKilobytes) {
    if (numKilobytes < 1024)
      return `${numKilobytes}KB`;
    else if (numKilobytes < 1024 * 1024) {
      const megabytes = (numKilobytes / 1024).toFixed(2);
      return `${megabytes}MB`;
    }
    else {
      const gigabytes = (numKilobytes / (1024 * 1024)).toFixed(2);
      return `${gigabytes}GB`;
    }
}

function Stat({title, info}) {
    return (
        <div className='stat-entry'>
            <p className='stat-paragraph'>{title}: <b>{info}</b></p>
        </div>
    );
}

function LanguagesView({sortedLanguageArray, totalBytesOfCode}) {
    return (
        <div style={{marginLeft: "20px", marginTop: "100px", paddingBottom: "40px", borderRadius:"20px"}}>
            <h3 style={{textDecoration: 'underline'}}>Language Statistics</h3>
            {
                sortedLanguageArray.map(([language, bytes]) => (
                    <Stat title={language} info={formatSize(bytes) + ` => ${((bytes/totalBytesOfCode) * 100).toFixed(2)}%`} />
                ))
            }
            <br />
            <Stat title={"Total bytes of code across all repositories"} info={formatSize(totalBytesOfCode)} />
        </div>
    )
}

function StatsView({stats}) {
    return (
        <div style={{ margin: '30px', width:"70%", display: 'flex', alignItems: 'center', padding: '20px', border: '1px solid', borderRadius: '20px', backgroundColor: '#00000030' }}>
            <img style={{ width: "30%", borderRadius:"20px"}} src={stats.avatar_url} />
            <div style={{ width: "70%", alignItems: 'center', flexDirection: 'column' }}>
                <h1>{stats.username}</h1>
                <Stat title="Total Repositories" info={stats.total_repositories} />
                <Stat title="Total Forks" info={stats.total_forks} />
                <Stat title="Total Stars" info={stats.total_stars} />
                <Stat title="Average Repo Size" info={formatSize(stats.average_repo_size_kb)} />

                <LanguagesView sortedLanguageArray={stats.language_bytes} totalBytesOfCode={stats.total_bytes_of_code}/>
            </div>
        </div>
    );
}

export default StatsView;
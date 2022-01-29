import { Grid, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { graphql, useStaticQuery } from "gatsby";
import React, { useMemo } from "react";
import team from "../../../data/team.yml";
import { Member, Social } from "../../../json_schemas/interfaces/schema_team";
import { shuffleArray } from "../../helpers";
import { getImageData, ImageData } from "../../helpers/images";
import { SocialLink } from "../commun/socials/socials";
import "./team.scss";

const members = shuffleArray(team.bureau) as Member[];

export const TeamMembers: React.FC = () => {
  // All team members pictures with the right size
  const imageQuery: ImageData = useStaticQuery(graphql`
    query Images(
      $width: Int = 200
      $height: Int = 200
      $pathGlob: String = "team/**/*"
    ) {
      ...imageData
    }
  `);

  const imageByMember = useMemo(() => {
    const mapObj = {};
    members.forEach(
      (member) => (mapObj[member.id] = getImageData(imageQuery, member.id))
    );
    return mapObj;
  }, [imageQuery]);

  return (
    <Grid container columnSpacing={3} rowSpacing={10} justifyContent="center">
      {members.map((member) => (
        <Grid
          item
          maxWidth={500}
          height="100%"
          width="100%"
          key={member.id}
          sm={12}
          md={6}
          lg={4}
        >
          <Box className="team-member">
            <div
              className="team-member-picture"
              style={{
                backgroundImage: `url('${
                  imageByMember[member.id].images.fallback.src
                }')`,
              }}
            ></div>

            <div className="member-info">
              <Typography variant="h3">
                {member.firstName} {member.lastName.toUpperCase()}
              </Typography>
              <Typography variant="h4">{member.title}</Typography>
              <List>
                {Object.entries(member.socials).map(([media, login]) => (
                  <SocialLink
                    key={media}
                    login={login}
                    type={media as keyof Social}
                  />
                ))}
              </List>
            </div>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

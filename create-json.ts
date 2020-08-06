// use this file content for `each-yml/handler.ts` in @friends-library/cli to regen *.json
import fs from 'fs';
import { getAllFriends } from '@friends-library/friends';

export default async function handler(): Promise<void> {
  const friends = getAllFriends('en');
  const friendsMap: any = {};
  const docsMap: any = {};

  friends.forEach((f) => {
    const fr: any = f.toJSON();
    fr.documents = f.documents.map((d) => d.id);
    friendsMap[f.id] = {
      id: fr.id,
      name: fr.name,
      alphabeticalName: fr.alphabeticalName,
      gender: fr.gender === `male` ? `male` : `female`,
      born: fr.born || null,
      died: fr.died || null,
      description: fr.description,
      residence: fr.primaryResidence || null,
      documents: fr.documents,
      url: `https://www.friendslibrary.com/friend/${fr.slug}`,
    };
    f.documents.forEach((d) => {
      const docJson = d.toJSON();
      docsMap[d.id] = {
        id: docJson.id,
        title: docJson.title,
        description: docJson.description,
        shortDescription: docJson.partialDescription,
        tags: docJson.tags,
        friendId: f.id,
        editions: d.editions.map((e) => ({
          type: e.type,
          isbn: e.isbn,
          imageUrl: `http://flp-assets.nyc3.digitaloceanspaces.com/en/${f.slug}/${docJson.slug}/${e.type}/${e.filenameBase}--audio.png`,
        })),
        url: `https://www.friendslibrary.com/${f.slug}/${docJson.slug}`,
      };
    });
  });

  const api = '/Users/jared/htc/api/functions';
  fs.writeFileSync(`${api}/friends.json`, JSON.stringify(friendsMap, null, 2));
  fs.writeFileSync(`${api}/documents.json`, JSON.stringify(docsMap, null, 2));
}

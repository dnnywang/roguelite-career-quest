import React from 'react';
import { NPC as NPCType } from '@/contexts/GameContext';

type NPCProps = {
  npc: NPCType;
};

const NPC: React.FC<NPCProps> = ({ npc }) => {
  if (npc.defeated) {
    return null;
  }

  // Get sprite image based on NPC type
  const getSprite = () => {
    switch (npc.type) {
      case 'Recruiter':
        return 'https://media.discordapp.net/attachments/1338984226766458932/1347817294360871002/2.png?ex=67cd342c&is=67cbe2ac&hm=5e46a5c6e7005f9f812dda0e51629b24b7c094fde44a658c6786c7fed0e5591e&=&format=webp&quality=lossless&width=830&height=856';
      case 'Intern':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347817292670697482/5.png?ex=67cd342b&is=67cbe2ab&hm=154495b9400931aeac3398787a0bc365a495e5976c0c059ef97d8e57a9404db1&';
      case 'Student':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347817292335026176/4.png?ex=67cd342b&is=67cbe2ab&hm=41120eccca46ede88593ffbd2071a3d95cb3b1eb435ae76c9e0477228de72ca2&';
      case 'Crackhead':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347817294759202897/3.png?ex=67cd342c&is=67cbe2ac&hm=52d29fbf669cc589d3140efd05ce4ec94d368229691da886f93a36da08afcb9f&';
      case 'Robber':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347817293459095573/7.png?ex=67cd342b&is=67cbe2ab&hm=5e12a886af66ab5937c85e4924afe3d3aff67406f1111d644e7a98c9294b93ca&';
      case 'Janitor':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347817293769343028/8.png?ex=67cd342c&is=67cbe2ac&hm=f233379053f1c9e312720ca50a6aadb258ee72f2ea876db174de5e9dad5125fd&';
      case 'Manager':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347817292964040714/6.png?ex=67cd342b&is=67cbe2ab&hm=bfd07f24754b93e0d5a0d282f5111971567df7b9b91aa8e56c4e410039e6b4b2&';
      case 'Policeman':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347818086006525972/9.png?ex=67cd34e8&is=67cbe368&hm=659089ede56d27278ab076fe9078a0996c4613f51bd98cc79a913a93695d5699&';
      case 'Skateboarder':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347818087151566888/12.png?ex=67cd34e9&is=67cbe369&hm=a2055d19c616307866d52d25386efffad497d4946803e3f1777c3f9ce2dd378e&';
      case 'Mailman':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347818085687623760/fake_mark.png?ex=67cd34e8&is=67cbe368&hm=9c0333eb7bc03267abb76c9f1ce033daa1527162f5c1e8f9a174732e6549100d&';
      case 'HR':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347818086744592394/11.png?ex=67cd34e9&is=67cbe369&hm=b43f81a20798d2a77348a31dfb9326b345241c579ec01ce112bc14244745fc82&';
      case 'Civilian':
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347818087507955763/13.png?ex=67cd34e9&is=67cbe369&hm=4a77225c58bf9d20385b1cd481a3f2f662b536b35a968c3492f06f224158226a&';
      default:
        return 'https://cdn.discordapp.com/attachments/1338984226766458932/1347818087507955763/13.png?ex=67cd34e9&is=67cbe369&hm=4a77225c58bf9d20385b1cd481a3f2f662b536b35a968c3492f06f224158226a&';
    }
  };

  // Determine sprite and hitbox size based on NPC type
  const getSpriteSize = () => {
    switch (npc.type) {
      case 'Recruiter':
        return '192px';
      case 'Manager':
        return '172px';
      case 'HR':
        return '172px';
      default:
        return '144px';
    }
  };

  return (
    <div
      className="npc pixel-art animate-pixel-bounce"
      style={{
        left: `${npc.position.x}px`,
        top: `${npc.position.y}px`,
        width: getSpriteSize(),
        height: getSpriteSize(),
        backgroundImage: `url(${getSprite()})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated'
      }}
    >
      <div 
        className="text-[8px] text-white font-bold text-center bg-black bg-opacity-50"
        style={{
          position: 'absolute',
          width: '100%',
          top: npc.type === 'Recruiter' ? '-30px' : '1px'
        }}
      >
        {npc.type}
      </div>
    </div>
  );
};

export default NPC;
